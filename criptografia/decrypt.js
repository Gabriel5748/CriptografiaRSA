//Descriptografia ficará aqui

function descriptografarRSA(mensagemC, d, n){
    return (Math.pow(mensagemC,d)) % n;
}

module.exports = {descriptografarRSA}