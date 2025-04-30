const readline = require('readline');
// const estado = require('../../models/estado');

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

async function escolherOpcao() {
    await pergunta('Informe a opção desejada: ');
}

function fecharPrograma(){
    rl.close();
    console.log("Saindo...");
}

// async function escreverMensagem() {
//     mensagemInput = await pergunta('Escreva sua mensagem: ');
//     chavesController.atualizarMensagemAtual(mensagemInput);

//     // await menuController.menu();

// }

module.exports = {rl,pergunta,escolherOpcao,fecharPrograma};