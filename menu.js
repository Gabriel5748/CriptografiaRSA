const criptografiaController = require('./criptografia/criptografiaRSA');
const chavesController = require('./chaves/leitura_chaves');
const inputController = require('./functions/menu_actions/input_utils');
const actions = require('./functions/menu_actions/menu_actions');
const estadoRSA = require('./chaves/leitura_chaves');

async function menu() {
    let opcao;
    let mensagem;

    while (opcao !== '8') {
        console.log("\n=== Menu Principal ===");
        console.log("1. Escolher números primos");
        console.log("2. Calcular chaves");
        console.log("3. Escrever mensagem");
        console.log("4. Criptografar mensagem");
        console.log("5. Descriptografar mensagem");
        console.log("6. Ver histórico de mensagens");
        console.log("7. Limpar chaves");
        console.log("8. Sair");

        opcao = await inputController.pergunta('Informe a opção desejada: ');

        switch (opcao) {
            case '1':
                await actions.escolherNumerosPrimos();
                break;
            case '2':
                actions.calcularChaves();
                break;
            case '3':
                mensagem = await inputController.pergunta('Escreva a mensagem: ');
                actions.escreverMensagem(mensagem);
                break;
            case '4':
                let criptografia = criptografiaController.criptografarRSA(estadoRSA.estado.mensagens.mensagem_atual);
                actions.escreverMensagem(criptografia);
                actions.adicionarHistorico(mensagem,criptografia);
                // chavesController.adicionarMensagemHistorico(mensagem,criptografia);
                break;
            case '5':
                // debugger;
                let mensagemD = criptografiaController.descriptografarRSA();
                // chavesController.atualizarMensagemAtual(mensagemD);
                actions.escreverMensagem(mensagemD);
                break;
            case '6':
                actions.verHistoricoMensagens();
                break;
            case '7':
                actions.limparChaves();
                break;
            case '8':
                actions.excluirDados();
                actions.fecharPrograma();
                return;
            default:
                console.log("\nOpção inválida!");
        }
    }
}

module.exports = { menu }

