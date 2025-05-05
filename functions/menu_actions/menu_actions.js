const estadoRSA = require('../../chaves/leitura_chaves');
const auxFunctionController = require('../../functions/aux_functions');
const inputController = require('./input_utils');
const chavesController = require('../../chaves/leitura_chaves');
// const { acharN, totiente, calcularE, acharD } = require('../../chaves/calculo_chaves');
const criptografiaController = require('../../criptografia/criptografiaRSA');

async function escolherNumerosPrimos() {
    if (!estadoRSA.estado.primosSelecionados) {
        do {
            estadoRSA.estado.chavesRSA.p = await inputController.pergunta('Informe um número primo: ');
            if (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.chavesRSA.p))) {
                console.log('Número inválido! Digite um número primo.');
            }
        } while (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.chavesRSA.p)));

        do {
            estadoRSA.estado.chavesRSA.q = await inputController.pergunta('Informe outro número primo: ');
            if (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.chavesRSA.q))) {
                console.log('Número inválido! Digite um número primo.');
            }
        } while (!auxFunctionController.verificarPrimo(Number(estadoRSA.estado.chavesRSA.q)));

        chavesController.atualizarPrimos(estadoRSA.estado.chavesRSA.p, estadoRSA.estado.chavesRSA.q);
    } else {
        console.warn("⚠️  Você já calculou as chaves. Para escolher novos primos, exclua os dados atuais (opção 7)");
    }
}


function calcularChaves() {
    chavesController.atualizarChaves();
}

function escreverMensagem(mensagem) {
    chavesController.atualizarMensagemAtual(mensagem);
}

function criptografarMensagem() {
    
    let mensagemC = criptografiaController.criptografarRSA(estadoRSA.estado.mensagens.mensagem_atual, estadoRSA.estado.chavesRSA.e, estadoRSA.estado.chavesRSA.n);
    chavesController.adicionarMensagemHistorico(estadoRSA.estado.mensagens.mensagem_atual, mensagemC);
}

function descriptografarMensagem() {
    criptografiaController.descriptografarRSA(estadoRSA.estado.mensagemCriptografada, estadoRSA.estado.chavesRSA.d, estadoRSA.estado.chavesRSA.n);
}

function adicionarHistorico(mensagem,criptografia){
    chavesController.adicionarMensagemHistorico(mensagem,criptografia);
}

function verHistoricoMensagens() {
    chavesController.verHistorico();
}

function limparChaves() {
    chavesController.limparChaves();
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
    adicionarHistorico,
    verHistoricoMensagens,
    limparChaves,
    excluirDados,
    fecharPrograma
};

