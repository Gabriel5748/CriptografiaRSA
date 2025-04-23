const { rl, pergunta } = require('./menu');
const { calcularMdc, totiente, acharD, acharN } = require('./chaves');
const { criptografarRSA, descriptografarRSA } = require('./criptografia/criptografiaRSA');
// const {criptografarASCII,descriptografarASCII} = require('./mapeamento_decimal/criptografia_ASCII');


async function main() {
    const p = await pergunta('Informe um número primo: ');
    const q = await pergunta('Informe outro número primo: ');

    console.log(`Você digitou: ${p} e ${q}`);

    const n = acharN(p, q)
    // console.log(`O produto de ${p} e ${q} é: ${n}`);

    const coprimos = totiente(p, q)
    // console.log(`O número de coprimos ${p} e ${q} é: ${coprimos}`);

    const e = calcularMdc(n, coprimos);
    // console.log(e)

    const d = acharD(e, coprimos);

    console.log("=== CHAVES RSA ===");
    console.log(`🔓 Chave Pública: (e = ${e}, n = ${n})`);
    console.log(`🔐 Chave Privada: (d = ${d}, n = ${n})`);
    console.log(`🧮 Valores internos: p = ${p}, q = ${q}, φ(n) = ${coprimos}`);

    const mensagem = await pergunta('Digite sua mensagem: ');
    const mensagemC = criptografarRSA(mensagem, e, n);
    console.log(`Mensagem criptografada: ${mensagemC}`)

    const mensagemD = descriptografarRSA(mensagemC, d, n);
    console.log(`Mensagem descriptografada: ${mensagemD}`)


    rl.close();

}

main();
