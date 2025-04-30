// const chavesController = require('../chaves/leitura_chaves');

// async function escolherNumerosPrimos() {
//     do {
//         p = await pergunta('Informe um número primo: ');
//         if (!verificarPrimo(Number(p))) {
//             console.log('Número inválido! Digite um número primo.');
//         }
//     } while (!verificarPrimo(Number(p)));

//     do {
//         q = await pergunta('Informe outro número primo: ');
//         if (!verificarPrimo(Number(q))) {
//             console.log('Número inválido! Digite um número primo.');
//         }
//     } while (!verificarPrimo(Number(q)));

//     chavesController.atualizarPrimos(p, q);

// //    await menuController.menu();
// }

// function calcularChaves() {
//     n = acharN(p, q);
//     coprimos = totiente(p, q);
//     e = calcularE(n);
//     d = acharD(e, coprimos);

//     chavesController.atualizarChaves(e, d, n);
//     chavesController.atualizarCoprimos(coprimos);

// }

// async function escreverMensagem() {
//     mensagemInput = await pergunta('Escreva sua mensagem: ');
//     chavesController.atualizarMensagemAtual(mensagemInput);

//     // await menuController.menu();

// }


function eNumero(valor) {
    return typeof valor === 'number' && !isNaN(valor);
}

function verificarPrimo(num) {
    if (!eNumero(num)) return false;
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

module.exports = {eNumero,verificarPrimo};