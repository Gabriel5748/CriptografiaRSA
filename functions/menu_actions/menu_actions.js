const inputController = require('./input_utils');
const criptografiaController = require('../../criptografia/criptografiaRSA');

const rsaState = require('../../models/rsa_state');
const stateUtils = require('../../models/rsa_utils');

async function escolherNumerosPrimos() {
    if (rsaState.temPrimosSelecionados()) {
        console.warn("Primos já selecionados");
        return;
    }
    do {
        p = await inputController.pergunta('Informe um número primo: ');
        if (!stateUtils.validarPrimo(Number(p))) {
            console.error('Número inválido! Digite um número primo.');
        }
    } while (!stateUtils.validarPrimo(Number(p)));

    do {
        q = await inputController.pergunta('Informe um número primo: ');
        if (!stateUtils.validarPrimo(Number(q))) {
            console.error('Número inválido! Digite um número primo.');
        }
    } while (!stateUtils.validarPrimo(Number(q)));

    rsaState.atualizarPrimos(p, q);
}

function calcularChaves() {
    try {

        if (!stateUtils.podeGerarChaves()) {
            console.error(
                "Não foi possível gerar as chaves. Verifique se:\n" +
                "- Dois números primos foram selecionados;\n" +
                "- As chaves ainda não foram geradas."
            );
        } else {
            rsaState.atualizarChaves();
            console.warn('Chaves geradas com sucesso!');
        }
    } catch (error) {
        console.error(`Erro ao gerar chaves: ${error.message}`);
    }
}

async function escreverMensagem() {
    const mensagem = await inputController.pergunta('Escreva a mensagem: ');
    if (stateUtils.validarMensagem(mensagem)) {
        rsaState.atualizarMensagemAtual(mensagem);
        console.warn('Mensagem salva com sucesso!');
    } else {
        console.warn('Mensagem inválida!');
    }
}

function criptografarMensagem() {
    let mensagemOriginal = rsaState.estado.mensagens.mensagem_atual;
    let mensagemC = criptografiaController.criptografarRSA(mensagemOriginal);

    rsaState.adicionarMensagemHistorico(mensagemOriginal, mensagemC);
}

function descriptografarMensagem() {
    criptografiaController.descriptografarRSA();
}

function verHistoricoMensagens() {
    rsaState.verHistorico();
}

function limparHistorico() {
    rsaState.excluirHistorico();
    console.warn('Limpando histórico...');
    console.warn('Histórico limpo!');

}

function limparChaves() {
    rsaState.limparChaves();
    console.warn('✅ Todas as chaves foram limpas com sucesso!');
}

function excluirDados() {
    rsaState.limparDados();
    console.warn('Todos os dados foram resetados!');
}

function fecharPrograma() {
    console.warn("Saindo...");
    inputController.rl.close();
}

module.exports = {
    escolherNumerosPrimos,
    calcularChaves,
    escreverMensagem,
    criptografarMensagem,
    descriptografarMensagem,
    limparHistorico,
    verHistoricoMensagens,
    limparChaves,
    excluirDados,
    fecharPrograma
};