//Criptografia ficará aqui
//O power não é muito preciso, para isso usamos exponenciação modular
function criptografarRSA(mensagem, e, n) {
    // 1. Validações básicas (sem verificar tamanho de n)
    if (typeof mensagem !== 'string' || !Number.isInteger(e) || !Number.isInteger(n) || n <= 0) {
        throw new Error('Parâmetros inválidos');
    }

    const blockSize = Math.max(1, Math.floor(Math.log2(n) / 8) - 1);

    const asciiArray = [];
    for (let i = 0; i < mensagem.length; i++) {
        const code = mensagem.charCodeAt(i);
        if (code > 255) {
            throw new Error('Caractere não-ASCII encontrado. Use apenas caracteres da tabela ASCII (0-255).');
        }
        asciiArray.push(code);
    }

    const cifrados = [];
    for (let i = 0; i < asciiArray.length; i += blockSize) {
        const bloco = asciiArray.slice(i, i + blockSize);

        let numeroBloco = 0;
        for (const code of bloco) {
            numeroBloco = numeroBloco * 1000 + code;
        }

        if (numeroBloco >= n) {
            throw new Error(`Bloco ${numeroBloco} é maior que n=${n}. Reduza o tamanho do bloco ou use n maior.`);
        }

        const cifrado = BigInt(numeroBloco) ** BigInt(e) % BigInt(n);
        cifrados.push(cifrado.toString());
    }

    return cifrados.join(' ');
}

function descriptografarRSA(mensagemC, d, n) {

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

        let asciiNumber;
        try {
            asciiNumber = Number(modPow(BigInt(bloco), BigInt(d), BigInt(n)));
        } catch (e) {
            throw new Error(`Erro durante a descriptografia: ${e.message}. Chaves podem estar incorretas.`);
        }

        if (asciiNumber < 0 || asciiNumber > 255) {
            throw new Error(`Valor descriptografado inválido: ${asciiNumber}. Chaves podem estar incorretas.`);
        }

        mensagemASCII += String.fromCharCode(asciiNumber);
    }

    return mensagemASCII;
}


function modPow(base, exponent, modulus) {
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

module.exports = { criptografarRSA, descriptografarRSA }