// const estado = require('../../models/estado');
const estadoRSA = require('../../chaves/leitura_chaves');
const auxFunctionController = require('../../functions/aux_functions');
const inputController = require('./input_utils');
const chavesController = require('../../chaves/leitura_chaves');
const { acharN, totiente, calcularE, acharD } = require('../../chaves/calculo_chaves');
const criptografiaController = require('../../criptografia/criptografiaRSA');

async function escolherNumerosPrimos() {
    if (!estadoRSA.estado.primosSelecionados) {
        do {
            estadoRSA.estado.p = await inputController.pergunta('Informe um número primo: ');
            if (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.p))) {
                console.log('Número inválido! Digite um número primo.');
            }
        } while (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.p)));

        do {
            estadoRSA.estado.q = await inputController.pergunta('Informe outro número primo: ');
            if (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.q))) {
                console.log('Número inválido! Digite um número primo.');
            }
        } while (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.q)));

        chavesController.atualizarPrimos(estadoRSA.estado.p, estadoRSA.estado.q);
    }else{
        console.warn("⚠️  Você já calculou as chaves. Para escolher novos primos, exclua os dados atuais (opção 7)");
    }
}


function calcularChaves() {
    estadoRSA.estado.n = acharN(estadoRSA.estado.p, estadoRSA.estado.q);
    estadoRSA.estado.coprimos = totiente(estadoRSA.estado.p, estadoRSA.estado.q);
    estadoRSA.estado.e = calcularE(estadoRSA.estado.n);
    estadoRSA.estado.d = acharD(estadoRSA.estado.e, estadoRSA.estado.coprimos);
    chavesController.atualizarChaves(estadoRSA.estado.e, estadoRSA.estado.d, estadoRSA.estado.n, estadoRSA.estado.coprimos);
}

async function escreverMensagem() {
    estadoRSA.estado.mensagemInput = await inputController.pergunta('Escreva sua mensagem: ');
    chavesController.atualizarMensagemAtual(estadoRSA.estado.mensagemInput);

    estadoRSA.estado.mensagemEscrita = true;

}

function criptografarMensagem() {
    estadoRSA.estado.mensagemCriptografada = criptografiaController.criptografarRSA(estadoRSA.estado.mensagemInput, estadoRSA.estado.e, estadoRSA.estado.n);
    chavesController.adicionarMensagemHistorico(estadoRSA.estado.mensagemInput, estadoRSA.estado.mensagemCriptografada);
}

function descriptografarMensagem() {
    criptografiaController.descriptografarRSA(estadoRSA.estado.mensagemCriptografada, estadoRSA.estado.d, estadoRSA.estado.n);
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

