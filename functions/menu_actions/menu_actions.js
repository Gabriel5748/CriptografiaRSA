const estado = require('../../models/estado');
const auxFunctionController = require('../../functions/aux_functions');
const inputController = require('./input_utils');
const chavesController = require('../../chaves/leitura_chaves');
const { acharN, totiente, calcularE, acharD } = require('../../chaves/calculo_chaves');
const criptografiaController = require('../../criptografia/criptografiaRSA');

async function escolherNumerosPrimos() {
    do {
        estado.p = await inputController.pergunta('Informe um número primo: ');
        if (!auxFunctionController.verificarPrimo(Number(estado.p))) {
            console.log('Número inválido! Digite um número primo.');
        }
    } while (!auxFunctionController.verificarPrimo(Number(estado.p)));

    do {
        estado.q = await inputController.pergunta('Informe outro número primo: ');
        if (!auxFunctionController.verificarPrimo(Number(estado.q))) {
            console.log('Número inválido! Digite um número primo.');
        }
    } while (!auxFunctionController.verificarPrimo(Number(estado.q)));

    chavesController.atualizarPrimos(estado.p, estado.q);
}

function calcularChaves() {
    estado.n = acharN(estado.p, estado.q);
    estado.coprimos = totiente(estado.p, estado.q);
    estado.e = calcularE(estado.n);
    estado.d = acharD(estado.e, estado.coprimos);
    chavesController.atualizarChaves(estado.e, estado.d, estado.n);
    chavesController.atualizarCoprimos(estado.coprimos);
}

async function escreverMensagem() {
    estado.mensagemInput = await inputController.pergunta('Escreva sua mensagem: ');
    chavesController.atualizarMensagemAtual(estado.mensagemInput);

    // await menuController.menu();

}

function criptografarMensagem() {
    estado.mensagemCriptografada = criptografiaController.criptografarRSA(estado.mensagemInput, estado.e, estado.n);
    chavesController.adicionarMensagemHistorico(estado.mensagemInput, estado.mensagemCriptografada);
}

function descriptografarMensagem() {
    criptografiaController.descriptografarRSA(estado.mensagemCriptografada, estado.d, estado.n);
}

function verHistoricoMensagens() {
    chavesController.verHistorico();
}

function excluirDados() {
    chavesController.limparDados();
}

function fecharPrograma() {
    console.log("Saindo...");
    inputController.rl.close();
}

module.exports = {
    escolherNumerosPrimos,
    calcularChaves,
    escreverMensagem,
    criptografarMensagem,
    descriptografarMensagem,
    verHistoricoMensagens,
    excluirDados,
    fecharPrograma
};

