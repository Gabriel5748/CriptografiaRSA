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
function criptografarRSA(mensagem, e, n) {

    if (!estadoRSA.estado.mensagemEscrita) {
        console.warn('⚠️ Escreva uma mensagem primeiro');
        return;
    }

    // Validação básica
    if (typeof mensagem !== 'string' || !Number.isInteger(e) || !Number.isInteger(n) || n <= 0) {
        throw new Error('Parâmetros inválidos');
    }

    // Converte cada caractere para código ASCII com padding de 3 dígitos
    const asciiCodes = [];
    for (let i = 0; i < mensagem.length; i++) {
        const code = mensagem.charCodeAt(i);
        if (code > 255) {
            throw new Error('Caractere não-ASCII encontrado. Use apenas caracteres da tabela ASCII (0-255).');
        }
        asciiCodes.push(code.toString().padStart(3, '0')); // <- padding aqui
    }

    // Define o tamanho ideal do bloco baseado em n
    const maxDigits = n.toString().length;
    const blockSize = Math.max(1, Math.floor((maxDigits - 1) / 3)); // 3 dígitos por caractere

    const cifrados = [];
    for (let i = 0; i < asciiCodes.length; i += blockSize) {
        const bloco = asciiCodes.slice(i, i + blockSize).join('');
        const numeroBloco = BigInt(bloco);

        if (numeroBloco >= BigInt(n)) {
            throw new Error(`Bloco ${bloco} é maior que n=${n}. Reduza o tamanho do bloco ou use n maior.`);
        }

        const cifrado = numeroBloco ** BigInt(e) % BigInt(n);
        cifrados.push(cifrado.toString());
    }

    estado.criptografada = true;

    return cifrados.join(' ');
}

function descriptografarRSA(mensagemC, d, n) {

    if (!estadoRSA.estado.criptografada) {
        console.warn('⚠️ Nenhuma mensagem criptografada para descriptografar.');
        return;
    }

    if (typeof mensagemC !== 'string' || !Number.isInteger(d) || !Number.isInteger(n) || n <= 0) {
        console.warn('Parâmetros inválidos para descriptografia RSA');
    }

    const blocosCifrados = mensagemC.split(' ').filter(Boolean).map(num => {
        const parsed = parseInt(num, 10);
        if (isNaN(parsed)) {
            throw new Error('Mensagem cifrada contém valores não numéricos');
        }
        return parsed;
    });

    let mensagemASCII = '';
    for (const bloco of blocosCifrados) {
        if (bloco >= n || bloco < 0) {
            throw new Error(`Valor cifrado ${bloco} é inválido para o módulo n=${n}`);
        }

        let numeroDescriptografado;
        try {
            numeroDescriptografado = Number(modPow(BigInt(bloco), BigInt(d), BigInt(n)));
        } catch (e) {
            throw new Error(`Erro durante a descriptografia: ${e.message}. Chaves podem estar incorretas.`);
        }

        // Converte o número de volta para os códigos ASCII dos caracteres originais
        let numeroBloco = numeroDescriptografado.toString();

        // Preenche à esquerda com zeros para que o comprimento seja múltiplo de 3
        if (numeroBloco.length % 3 !== 0) {
            numeroBloco = numeroBloco.padStart(Math.ceil(numeroBloco.length / 3) * 3, '0');
        }

        // Separa a string em blocos de 3 dígitos e converte para caracteres
        for (let i = 0; i < numeroBloco.length; i += 3) {
            const asciiCode = parseInt(numeroBloco.slice(i, i + 3), 10);
            if (asciiCode < 0 || asciiCode > 255) {
                throw new Error(`Código ASCII inválido: ${asciiCode}. Chaves podem estar incorretas.`);
            }
            mensagemASCII += String.fromCharCode(asciiCode);
        }
    }

    return mensagemASCII;
}


module.exports = { criptografarRSA, descriptografarRSA }