const readline = require('readline');

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
    console.warn("Saindo...");
}

module.exports = {rl,pergunta,escolherOpcao,fecharPrograma};