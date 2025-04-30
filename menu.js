const criptografiaController = require('./criptografia/criptografiaRSA');
const chavesController = require('./chaves/leitura_chaves');
const inputController = require('./functions/menu_actions/input_utils');
const actions = require('./functions/menu_actions/menu_actions');
const estado = require('./models/estado');

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

        opcao = await inputController.pergunta('Informe a opção desejada: ');

        switch (opcao) {
            case '1':
                await actions.escolherNumerosPrimos();
                break;
            case '2':
                actions.calcularChaves();
                break;
            case '3':
                await actions.escreverMensagem();
                break;
            case '4':
                estado.mensagemCriptografada = criptografiaController.criptografarRSA(estado.mensagemInput,estado.e,estado.n);
                chavesController.atualizarMensagemAtual(estado.mensagemCriptografada);
                chavesController.adicionarMensagemHistorico(estado.mensagemInput,estado.mensagemCriptografada);
                break;
            case '5':
                estado.mensagemDescriptografada = criptografiaController.descriptografarRSA(estado.mensagemCriptografada,estado.d,estado.n);
                chavesController.atualizarMensagemAtual(estado.mensagemDescriptografada);
                break;
            case '6':
                actions.verHistoricoMensagens();
                break;
            case '7':
                actions.excluirDados();
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

