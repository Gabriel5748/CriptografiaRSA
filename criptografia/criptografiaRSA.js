//Criptografia ficará aqui

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
    if (!estadoRSA.estado.mensagemEscrita) {
        console.warn('⚠️ Escreva uma mensagem primeiro');
        return;
    }

    // Validação básica
    if (typeof mensagem !== 'string' || !Number.isInteger(estadoRSA.estado.chavesRSA.e) || !Number.isInteger(estadoRSA.estado.chavesRSA.n) || estadoRSA.estado.chavesRSA.n <= 0) {
        console.warn('Parâmetros inválidos para criptografia RSA');
        return;
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
        return;
    }

    // Define o tamanho ideal do bloco baseado em n
    const maxDigits = estadoRSA.estado.chavesRSA.n.toString().length;
    const blockSize = Math.max(1, Math.floor((maxDigits - 1) / 3)); // 3 dígitos por caractere

    const cifrados = [];
    for (let i = 0; i < asciiCodes.length; i += blockSize) {
        const bloco = asciiCodes.slice(i, i + blockSize).join('');
        const numeroBloco = BigInt(bloco);

        if (numeroBloco >= BigInt(estadoRSA.estado.chavesRSA.n)) {
            console.warn(`Bloco ${bloco} é maior que n=${estadoRSA.estado.chavesRSA.n}. Reduza o tamanho do bloco ou use n maior.`);
            continue;
        }

        const cifrado = numeroBloco ** BigInt(estadoRSA.estado.chavesRSA.e) % BigInt(estadoRSA.estado.chavesRSA.n);
        cifrados.push(cifrado.toString());
    }

    if (cifrados.length === 0) {
        console.warn('Nenhum bloco foi criptografado com sucesso.');
        return;
    }

    // estadoRSA.estado.mensagens.mensagem_atual = cifrados.join(' ');

    estadoRSA.estado.criptografada = true;

    return cifrados.join(' ');

    // return;
}


function descriptografarRSA() {
    // debugger;
    if (!estadoRSA.estado.criptografada) {
        console.warn('⚠️ Nenhuma mensagem criptografada para descriptografar.');
        return;
    }

    if (typeof estadoRSA.estado.mensagens.mensagem_atual !== 'string' || !Number.isInteger(estadoRSA.estado.chavesRSA.d) || !Number.isInteger(estadoRSA.estado.chavesRSA.n) || estadoRSA.estado.chavesRSA.n <= 0) {
        console.warn('Parâmetros inválidos para descriptografia RSA');
        return;
    }

    let blocosCifrados = [];
    try {
        blocosCifrados = estadoRSA.estado.mensagens.mensagem_atual.split(' ').filter(Boolean).map(num => {
            const parsed = parseInt(num, 10);
            if (isNaN(parsed)) {
                console.warn('Mensagem cifrada contém valores não numéricos:', num);
                return null;
            }
            return parsed;
        }).filter(num => num !== null);
    } catch (e) {
        console.warn('Erro ao processar a mensagem cifrada:', e.message);
        return;
    }

    let mensagemASCII = '';
    for (const bloco of blocosCifrados) {
        if (bloco >= estadoRSA.estado.chavesRSA.n || bloco < 0) {
            console.warn(`Valor cifrado ${bloco} é inválido para o módulo n=${n}`);
            continue;
        }

        let numeroDescriptografado;
        try {
            numeroDescriptografado = Number(modPow(BigInt(bloco), BigInt(estadoRSA.estado.chavesRSA.d), BigInt(estadoRSA.estado.chavesRSA.n)));
        } catch (e) {
            console.warn(`Erro durante a descriptografia: ${e.message}. Chaves podem estar incorretas.`);
            continue;
        }

        let numeroBloco = numeroDescriptografado.toString();
        if (numeroBloco.length % 3 !== 0) {
            numeroBloco = numeroBloco.padStart(Math.ceil(numeroBloco.length / 3) * 3, '0');
        }

        for (let i = 0; i < numeroBloco.length; i += 3) {
            const asciiCode = parseInt(numeroBloco.slice(i, i + 3), 10);
            if (asciiCode < 0 || asciiCode > 255) {
                console.warn(`Código ASCII inválido: ${asciiCode}. Chaves podem estar incorretas.`);
                continue;
            }
            mensagemASCII += String.fromCharCode(asciiCode);
        }
    }

    estadoRSA.estado.criptografada = false;

    return mensagemASCII;

    // estadoRSA.estado.mensagens.mensagem_atual = mensagemASCII;

    // return;
}



module.exports = { criptografarRSA, descriptografarRSA }