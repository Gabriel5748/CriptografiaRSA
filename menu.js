const readline = require('readline');
const { calcularE, acharN, totiente, acharD } = require('./calculo_chaves');
const { criptografarRSA, descriptografarRSA } = require('./criptografia/criptografiaRSA');
const { atualizarChaves, atualizarMensagemAtual, atualizarPrimos, atualizarCoprimos, adicionarMensagemHistorico, verHistorico, limparDados } = require('./leitura_chaves');

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

}

async function escreverMensagem() {
    mensagemInput = await pergunta('Escreva sua mensagem: ');
    atualizarMensagemAtual(mensagemInput);

    await menu();
}

async function menu() {
    let opcao = '';

    while (opcao !== '8') {
        console.log("\n=== Menu Principal ===");
        console.log("1. Escolher números primos");
        console.log("2. Calcular chaves");
        console.log("3. Escrever mensagem");
        console.log("4. Criptografar mensagem");
        console.log("5. Descriptografar mensagem");
        console.log("6. Ver histórico de mensagens");
        console.log("7. Excluir Dados");
        console.log("8. Sair");

        opcao = await pergunta('Informe a opção desejada: ')

        switch (opcao) {
            case '1':
                escolherNumerosPrimos();
                break;
            case '2':
                calcularChaves();

                break;
            case '3':
                //Botar pra atualizar a mensagem que o usuario digitar aqui
                escreverMensagem();
                break;
            case '4':
                mensagemCriptografada = criptografarRSA(mensagemInput, e, n);

                atualizarMensagemAtual(mensagemCriptografada);

                let chaves = {
                    publica: `{ ${e} , ${n} }`,
                    privada: `{ ${d} , ${n} }`
                };

                adicionarMensagemHistorico(mensagemInput, mensagemCriptografada, chaves);
                break;
            case '5':
                mensagemDescriptografada = descriptografarRSA(mensagemCriptografada, d, n);
                atualizarMensagemAtual(mensagemDescriptografada);
                break;
            case '6':
                verHistorico();
                break;
            case '7':
                limparDados();
                break;
            case '8':
                //Toda vez que o algoritmo for encerrado ele limpa os dados
                limparDados();
                console.log("Saindo...");
                rl.close();
                return;
            default:
                console.log("\nOpção inválida!");
        }
    }
}


module.exports = { rl, pergunta, menu }

