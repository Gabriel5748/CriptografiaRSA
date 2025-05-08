const inputController = require('./functions/menu_actions/input_utils');
const actions = require('./functions/menu_actions/menu_actions');

async function menu() {
    let opcao;
    
    while (opcao !== '9') {
        console.log("\n=== Menu Principal ===");
        console.log("1. Escolher números primos");
        console.log("2. Calcular chaves");
        console.log("3. Escrever mensagem");
        console.log("4. Criptografar mensagem");
        console.log("5. Descriptografar mensagem");
        console.log("6. Ver histórico de mensagens");
        console.log("7. Limpar chaves");
        console.log("8. Limpar histórico");
        console.log("9. Sair");

        opcao = await inputController.pergunta('Informe a opção desejada: ');

        try {
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
                    actions.criptografarMensagem();
                    break;
                case '5':
                    actions.descriptografarMensagem();
                    break;
                case '6':
                    actions.verHistoricoMensagens();
                    break;
                case '7':
                    actions.limparChaves();
                    break;
                case '8':
                    actions.limparHistorico();
                    break;
                case '9':
                    actions.excluirDados();
                    actions.fecharPrograma();
                    return;
                default:
                    console.warn("\nOpção inválida!");
            }
        } catch (error) {
            console.error(`❌ Erro: ${error.message}`);
        }
    }
}

module.exports = { menu };