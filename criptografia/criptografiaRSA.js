//Criptografia ficará aqui
//O power não é muito preciso, para isso usamos exponenciação modular
function criptografarRSA(mensagem, e, n) {
    // 1. Validações básicas (sem verificar tamanho de n)
    if (typeof mensagem !== 'string' || !Number.isInteger(e) || !Number.isInteger(n) || n <= 0) {
        throw new Error('Parâmetros inválidos');
    }

    // 2. Tamanho do bloco ajustado para n pequeno
    const blockSize = Math.max(1, Math.floor(Math.log2(n) / 8) - 1); // Reduz padding para caber em n pequeno

    // 3. Converter mensagem para ASCII (suporta apenas caracteres 0-255)
    const asciiArray = [];
    for (let i = 0; i < mensagem.length; i++) {
        const code = mensagem.charCodeAt(i);
        if (code > 255) {
            throw new Error('Caractere não-ASCII encontrado. Use apenas caracteres da tabela ASCII (0-255).');
        }
        asciiArray.push(code);
    }

    // 4. Criptografar cada bloco (ajustado para n pequeno)
    const cifrados = [];
    for (let i = 0; i < asciiArray.length; i += blockSize) {
        const bloco = asciiArray.slice(i, i + blockSize);

        // Converter bloco ASCII para número (ex: [72, 69] -> 7269)
        let numeroBloco = 0;
        for (const code of bloco) {
            numeroBloco = numeroBloco * 1000 + code; // Usa 3 dígitos por código ASCII
        }

        // Verificar se o bloco cabe em n
        if (numeroBloco >= n) {
            throw new Error(`Bloco ${numeroBloco} é maior que n=${n}. Reduza o tamanho do bloco ou use n maior.`);
        }

        // Criptografar com RSA (usando BigInt para evitar overflow)
        const cifrado = BigInt(numeroBloco) ** BigInt(e) % BigInt(n);
        cifrados.push(cifrado.toString());
    }

    return cifrados.join(' ');
}

function descriptografarRSA(mensagemC, d, n) {

    // 1. Validação dos parâmetros
    if (typeof mensagemC !== 'string' || !Number.isInteger(d) || !Number.isInteger(n) || n <= 0) {
        console.warn('Parâmetros inválidos para descriptografia RSA');
    }

    // 2. Converter string cifrada para array de números
    const blocosCifrados = mensagemC.split(' ').filter(Boolean).map(num => {
        const parsed = parseInt(num, 10);
        if (isNaN(parsed)) {
            throw new Error('Mensagem cifrada contém valores não numéricos');
        }
        return parsed;
    });

    // 3. Descriptografar cada bloco
    let mensagemASCII = '';
    for (const bloco of blocosCifrados) {
        // Verifica se o bloco é menor que n e não negativo
        if (bloco >= n || bloco < 0) {
            throw new Error(`Valor cifrado ${bloco} é inválido para o módulo n=${n}`);
        }

        // Usa BigInt para cálculos seguros com números grandes
        let asciiNumber;
        try {
            asciiNumber = Number(modPow(BigInt(bloco), BigInt(d), BigInt(n)));
        } catch (e) {
            throw new Error(`Erro durante a descriptografia: ${e.message}. Chaves podem estar incorretas.`);
        }

        // Verifica se o resultado é um código ASCII válido
        if (asciiNumber < 0 || asciiNumber > 255) {
            throw new Error(`Valor descriptografado inválido: ${asciiNumber}. Chaves podem estar incorretas.`);
        }

        mensagemASCII += String.fromCharCode(asciiNumber);
    }

    return mensagemASCII;
}


function modPow(base, exponent, modulus) {
    // Implementação segura de exponenciação modular
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