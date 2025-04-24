const readline = require('readline');
const { calcularE, acharN, totiente, acharD } = require('./chaves');
const { criptografarRSA, descriptografarRSA } = require('./criptografia/criptografiaRSA');
const { atualizarChaves, atualizarMensagem, atualizarPrimos, atualizarCoprimos, adicionarMensagemHistorico, limparDados } = require('./leitura_chaves');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pergunta = (pergunta) => {
    return new Promise((resolve) => {
        rl.question(pergunta, (resposta) => {
            resolve(resposta);
        });
    });
}

function verificarPrimo(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// let mensagemAtual = '';
// let mensagemCriptografada = '';
// let mensagemDescriptografada = '';
// let chavesRSA = {
//     p: null,
//     q: null,
//     n: null,
//     e: null,
//     d: null,
//     coprimos: null
// }

//Talvez dê para melhorar isso - deixar para depois
let mensagemInput = '';
let mensagemCriptografada = '';
let mensagemDescriptografada = '';
let p = null;
let q = null;
let n = null;
let e = null;
let d = null;
let coprimos = null;


async function escolherNumerosPrimos() {
    do {
        p = await pergunta('Informe um número primo: ');
        if (!verificarPrimo(Number(p))) {
            console.log('Número inválido! Digite um número primo.');
        }
    } while (!verificarPrimo(Number(p)));

    do {
        q = await pergunta('Informe outro número primo: ');
        if (!verificarPrimo(Number(q))) {
            console.log('Número inválido! Digite um número primo.');
        }
    } while (!verificarPrimo(Number(q)));

    atualizarPrimos(p, q);
    await menu();
}

function calcularChaves() {
    n = acharN(p, q);
    coprimos = totiente(p, q);
    e = calcularE(n);
    d = acharD(e, coprimos);

    atualizarChaves(e, d, n);
    atualizarCoprimos(coprimos);

    //DECLARAR OUTRA FUNÇÃO SÓ PARA EXIBIR ISSO

    // console.log("=== CHAVES RSA ===");
    // console.log(`🔓 Chave Pública: (e = ${chavesRSA.e}, n = ${chavesRSA.n})`);
    // console.log(`🔐 Chave Privada: (d = ${chavesRSA.d}, n = ${chavesRSA.n})`);
    // console.log(`🧮 Valores internos: p = ${chavesRSA.p}, q = ${chavesRSA.q}, φ(n) = ${chavesRSA.coprimos}`);

}

async function escreverMensagem() {
    mensagemInput = await pergunta('Escreva sua mensagem: ');

    await menu();
}

async function menu() {
    let opcao = '';

    while (opcao !== '7') {
        console.log("\n=== Menu Principal ===");
        console.log("1. Escolher números primos");
        console.log("2. Calcular chaves");
        console.log("3. Escrever mensagem");
        console.log("4. Criptografar mensagem");
        console.log("5. Descriptografar mensagem");
        console.log("6. Limpar dados");
        console.log("7. Sair");

        opcao = await pergunta('Informe a opção desejada: ')

        switch (opcao) {
            case '1':
                escolherNumerosPrimos();
                break;
            case '2':
                calcularChaves();

                //Talvez não deva ficar aqui
                // atualizarChaves(e, d);
                // atualizarCoprimos(coprimos);
                break;
            case '3':

            //Botar pra atualizar a mensagem que o usuario digitar aqui
                escreverMensagem();
                break;
            case '4':
                mensagemCriptografada = criptografarRSA(mensagemInput, e, n);
                console.log(`Mensagem criptografada: ${mensagemCriptografada}`);

                //Têm que botar pra atualizar so a mensagem C 
                atualizarMensagem(mensagemInput, mensagemCriptografada);


                //Botando aqui pq a partir do momento q ele faz a criptografia, a mensagem ja esta salva
                adicionarMensagemHistorico(mensagemInput);
                break;
            case '5':
                mensagemDescriptografada = descriptografarRSA(mensagemCriptografada, d, n);
                // console.log(`Mensagem descriptografada: ${mensagemDescriptografada}`);
                break;
            case '6':
                limparDados();
                break;
            case '7':
                console.log("Saindo...");
                rl.close();
                return;
            default:
                console.log("\nOpção inválida!");
        }
    }
}


module.exports = { rl, pergunta, menu }

