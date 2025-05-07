//Criptografia ficará aqui

const rsaState = require('../models/rsa_state');
const stateUtils = require('../models/rsa_utils');

const estadoRSA = require("../chaves/leitura_chaves");

function modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1n; // Divide por 2
        base = (base * base) % modulus;
    }

    return result;
}


//O power não é muito preciso, para isso usamos exponenciação modular
function criptografarRSA(mensagem) {
    // Verifica pré-condições usando o utilitário
    if (!stateUtils.podeCriptografar()) {
        console.warn('⚠️  Selecione os primos, calcule as chaves e escreva uma mensagem para poder criptografar');
        return null;
    }

    // Validação básica da mensagem
    if (!stateUtils.validarMensagem(mensagem)) {
        console.warn('Mensagem inválida para criptografia RSA');
        return null;
    }

    // Verifica se as chaves são válidas
    if (!Number.isInteger(rsaState.estado.chavesRSA.e) || 
        !Number.isInteger(rsaState.estado.chavesRSA.n) || 
        rsaState.estado.chavesRSA.n <= 0) {
        console.warn('Chaves RSA inválidas para criptografia');
        return null;
    }

    // Converte cada caractere para código ASCII com padding de 3 dígitos
    const asciiCodes = [];
    for (let i = 0; i < mensagem.length; i++) {
        const code = mensagem.charCodeAt(i);
        if (code > 255) {
            console.warn(`Caractere não-ASCII encontrado (${mensagem[i]} = ${code}). Use apenas caracteres ASCII (0-255).`);
            continue;
        }
        asciiCodes.push(code.toString().padStart(3, '0'));
    }

    if (asciiCodes.length === 0) {
        console.warn('Nenhum caractere válido encontrado para criptografar.');
        return null;
    }

    // Define o tamanho ideal do bloco baseado em n
    const maxDigits = rsaState.estado.chavesRSA.n.toString().length;
    const blockSize = Math.max(1, Math.floor((maxDigits - 1) / 3)); // 3 dígitos por caractere

    const cifrados = [];
    for (let i = 0; i < asciiCodes.length; i += blockSize) {
        const bloco = asciiCodes.slice(i, i + blockSize).join('');
        const numeroBloco = BigInt(bloco);

        if (numeroBloco >= BigInt(rsaState.estado.chavesRSA.n)) {
            console.warn(`Bloco ${bloco} é maior que n=${rsaState.estado.chavesRSA.n}. Reduza o tamanho do bloco ou use n maior.`);
            continue;
        }

        const cifrado = modPow(
            numeroBloco, 
            BigInt(rsaState.estado.chavesRSA.e), 
            BigInt(rsaState.estado.chavesRSA.n)
        );
        cifrados.push(cifrado.toString());
    }

    if (cifrados.length === 0) {
        console.warn('Nenhum bloco foi criptografado com sucesso.');
        return null;
    }

    // Atualiza o estado
    rsaState.estado.criptografada = true;
    rsaState.estado.mensagens.mensagem_atual = cifrados.join(' ');
    rsaState.salvarEstado();

    return cifrados.join(' ');
}

function descriptografarRSA() {
    // Verifica pré-condições usando o utilitário
    if (!stateUtils.podeDescriptografar()) {
        console.warn('⚠️ Pré-condições não atendidas: Verifique se há mensagem criptografada e chaves válidas');
        return null;
    }

    // Validação das chaves
    if (!Number.isInteger(rsaState.estado.chavesRSA.d) || 
        !Number.isInteger(rsaState.estado.chavesRSA.n) || 
        rsaState.estado.chavesRSA.n <= 0) {
        console.warn('Chaves RSA inválidas para descriptografia');
        return null;
    }

    // Processa os blocos cifrados
    let blocosCifrados = [];
    try {
        blocosCifrados = rsaState.estado.mensagens.mensagem_atual
            .split(' ')
            .filter(Boolean)
            .map(num => {
                const parsed = parseInt(num, 10);
                if (isNaN(parsed)) {
                    console.warn('Valor não numérico na mensagem cifrada:', num);
                    return null;
                }
                return parsed;
            })
            .filter(num => num !== null);
    } catch (e) {
        console.warn('Erro ao processar mensagem cifrada:', e.message);
        return null;
    }

    // Descriptografa cada bloco
    let mensagemASCII = '';
    for (const bloco of blocosCifrados) {
        if (bloco >= rsaState.estado.chavesRSA.n || bloco < 0) {
            console.warn(`Valor cifrado ${bloco} é inválido para o módulo n=${rsaState.estado.chavesRSA.n}`);
            continue;
        }

        let numeroDescriptografado;
        try {
            numeroDescriptografado = Number(
                modPow(
                    BigInt(bloco), 
                    BigInt(rsaState.estado.chavesRSA.d), 
                    BigInt(rsaState.estado.chavesRSA.n)
                )
            );
        } catch (e) {
            console.warn(`Erro durante descriptografia: ${e.message}. Verifique as chaves.`);
            continue;
        }

        // Converte para string com padding de 3 dígitos
        let numeroBloco = numeroDescriptografado.toString();
        if (numeroBloco.length % 3 !== 0) {
            numeroBloco = numeroBloco.padStart(Math.ceil(numeroBloco.length / 3) * 3, '0');
        }

        // Converte cada trio de dígitos para caractere ASCII
        for (let i = 0; i < numeroBloco.length; i += 3) {
            const asciiCode = parseInt(numeroBloco.slice(i, i + 3), 10);
            if (asciiCode < 0 || asciiCode > 255) {
                console.warn(`Código ASCII inválido: ${asciiCode}. Verifique as chaves.`);
                continue;
            }
            mensagemASCII += String.fromCharCode(asciiCode);
        }
    }

    rsaState.estado.criptografada = false;
    rsaState.estado.mensagens.mensagem_atual = mensagemASCII;
    rsaState.salvarEstado();

    return;

    // return mensagemASCII;
}



module.exports = { criptografarRSA, descriptografarRSA }