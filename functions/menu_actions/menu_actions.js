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
            console.warn('Número inválido! Digite um número primo.');
        }
    } while (!stateUtils.validarPrimo(Number(p)));

    do {
        q = await inputController.pergunta('Informe um número primo: ');
        if (!stateUtils.validarPrimo(Number(q))) {
            console.warn('Número inválido! Digite um número primo.');
        }
    } while (!stateUtils.validarPrimo(Number(q)));

    rsaState.atualizarPrimos(p, q);
}

function calcularChaves() {
    try {

        if (!stateUtils.podeGerarChaves()) {
            console.warn('Chaves já foram geradas, apague-as para definir novas chaves (Opção 7');
        } else {
            rsaState.atualizarChaves();
            console.warn('Chaves geradas com sucesso!');
            // n: ${rsaState.estado.chavesRSA.n}
            // e: ${rsaState.estado.chavesRSA.e}
            // d: ${rsaState.estado.chavesRSA.d}`);
        }
    } catch (error) {
        console.warn(`Erro ao gerar chaves: ${error.message}`);
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
    try {

        if (stateUtils.podeCriptografar()) {
            let mensagemOriginal = rsaState.estado.mensagens.mensagem_atual;
            let mensagemC = criptografiaController.criptografarRSA(mensagemOriginal);

            if (mensagemC) {
                rsaState.adicionarMensagemHistorico(mensagemOriginal, mensagemC);
                console.warn('Mensagem criptografada com sucesso!');
            }
        } else {
            console.warn('Não é possível criptografar');
        }
    } catch (error) {
        console.warn(`Erro ao criptografar: ${error.message}`);
    }
}

function descriptografarMensagem() {
    try {
        if (stateUtils.podeDescriptografar) {
            criptografiaController.descriptografarRSA();

            console.warn('Mensagem descriptografada com sucesso!');
        } else {
            console.warn('Não foi possível descriptografar');
        }
    } catch (error) {
        console.warn(`Erro ao descriptografar: ${error.message}`);
    }
}

// function adicionarHistorico(mensagem, criptografia) {
//     rsaState.adicionarMensagemHistorico(mensagem, criptografia);
// }

function verHistoricoMensagens() {
    rsaState.verHistorico();
}

function limparHistorico(){
    rsaState.excluirHistorico();
}

function limparChaves() {
    rsaState.limparChaves();
    console.warn('Chaves limpas com sucesso!');
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