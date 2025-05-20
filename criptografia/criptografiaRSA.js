//Criptografia ficará aqui

const rsaState = require('../models/rsa_state');
const stateUtils = require('../models/rsa_utils');

function modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1n;
        base = (base * base) % modulus;
    }

    return result;
}


//O power não é muito preciso, para isso usamos exponenciação modular
function criptografarRSA(mensagem) {
    if (!stateUtils.podeCriptografar()) {
        console.error(
            "Não foi possível criptografar a mensagem. Verifique se:\n" +
            "- Dois números primos foram selecionados;\n" +
            "- As chaves foram geradas corretamente;\n" +
            "- A mensagem foi escrita;\n" +
            "- A mensagem ainda não está criptografada."
        );
        return;
    }

    const asciiCodes = [];
    for (let i = 0; i < mensagem.length; i++) {
        const code = mensagem.charCodeAt(i);
        if (code > 255) {
            console.error(`Caractere não-ASCII encontrado (${mensagem[i]} = ${code}). Use apenas caracteres ASCII (0-255).`);
            continue;
        }
        asciiCodes.push(code.toString().padStart(3, '0'));
    }

    if (asciiCodes.length === 0) {
        console.error('Nenhum caractere válido encontrado para criptografar.');
        return null;
    }

    const maxDigits = rsaState.estado.chavesRSA.n.toString().length;
    const blockSize = Math.max(1, Math.floor((maxDigits - 1) / 3));

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

    console.warn('Mensagem criptografada com sucesso!');

    return cifrados.join(' ');
}

function descriptografarRSA() {
    if (!stateUtils.podeDescriptografar()) {
        console.error(
            "Não foi possível descriptografar a mensagem. Verifique se:\n" +
            "- As chaves foram geradas;\n" +
            "- A mensagem está criptografada."
        );

        return;
    }

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
            console.error(`Erro durante descriptografia: ${e.message}. Verifique as chaves.`);
            continue;
        }

        let numeroBloco = numeroDescriptografado.toString();
        if (numeroBloco.length % 3 !== 0) {
            numeroBloco = numeroBloco.padStart(Math.ceil(numeroBloco.length / 3) * 3, '0');
        }

        for (let i = 0; i < numeroBloco.length; i += 3) {
            const asciiCode = parseInt(numeroBloco.slice(i, i + 3), 10);
            if (asciiCode < 0 || asciiCode > 255) {
                console.error(`Código ASCII inválido: ${asciiCode}. Verifique as chaves.`);
                continue;
            }
            mensagemASCII += String.fromCharCode(asciiCode);
        }
    }

    rsaState.estado.criptografada = false;
    rsaState.estado.mensagens.mensagem_atual = mensagemASCII;
    rsaState.salvarEstado();

    console.warn('Mensagem descriptografada com sucesso!');

    return;

}



module.exports = { criptografarRSA, descriptografarRSA }