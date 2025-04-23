//Criptografia ficará aqui
const { criptografarASCII, desccriptografarASCII } = require('../mapeamento_decimal/criptografia_ASCII');

//O power não é muito preciso, para isso usamos exponenciação modular
function criptografarRSA(mensagem, e, n) {
    let resultado = '';
    for (let i = 0; i < mensagem.length; i++) {
        let valorASCII = mensagem.charCodeAt(i);
        //Passa o valor ASCII para a criptografia RSA
        let criptografado = modPow(valorASCII, e, n);
        resultado += criptografado + ' ';
    }

    return resultado.trim();
}


function descriptografarRSA(mensagemC, d, n) {
    let resultado = '';
    let criptografado = mensagemC.split(' ');

    for (let i = 0; i < criptografado.length; i++) {
        let numCriptografado = parseInt(criptografado[i], 10);
        let ascii = modPow(numCriptografado, d, n);
        resultado += String.fromCharCode(ascii);
    }

    return resultado;
}

function modPow(base, exp, mod) {
    let res = 1;
    base %= mod;

    while (exp > 0) {
        if (exp % 2 === 1) {
            res = (res * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }

    return res;
}


module.exports = { criptografarRSA, descriptografarRSA }