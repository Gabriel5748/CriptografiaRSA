//Teoricamente temos o E aqui
function calcularMdc(n, tamanho) {
    let e = [];
    let divisor = 1;

    while (e.length < tamanho && divisor < n) {
        if (gcd(divisor, n) === 1) {
            e.push(divisor);
        }
        divisor++;
    }

    if (e.length === 0) {
        throw new Error("Não foi possível encontrar valores coprimos.");
    }

    let indice = Math.floor(Math.random() * e.length);
    console.log(`Possíveis valores de e: ${e}`);

    return e[indice];
}

//Função auxiliar - máximo divisor comum
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

//Fórmula usada para calcular o número de coprimos em relação à um número
function totiente(p, q) {
    return (p - 1) * (q - 1);
}

//Recebe o E da nossa função de calcular MDC e o nosso número de coprimos do totiente
//Retorna o D
function acharD(e, totiente) {
    let i = 1;
    while (i < totiente) {
        if ((e * i) % totiente == 1) {
            console.log("d vale: " + i);
            return i;
        }
        i++;
    }
    console.log("Não foi encontrado um d válido.");
    return null;
}

//Temos o N
function acharN(p, q) {
    return p * q;
}


module.exports = {calcularMdc,totiente,acharD,acharN};
