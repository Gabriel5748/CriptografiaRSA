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

function fecharPrograma(){
    rl.close();
    console.warn("Saindo...");
}

module.exports = {rl,pergunta,fecharPrograma};