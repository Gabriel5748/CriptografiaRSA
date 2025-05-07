const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '..', 'chavesRSA.json');
const dados = fs.readFileSync(arquivo, 'utf-8');
const estado = JSON.parse(dados);

// Salva os dados de volta no arquivo JSON
function salvarEstado(dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 4), 'utf-8');
}

 function atualizarMensagemAtual(mensagem) {
    estado.mensagens.mensagem_atual = mensagem
    estado.mensagemEscrita = true;

    salvarEstado(estado);
}

function atualizarPrimos(primo1, primo2) {

    // if(estado.primosSelecionados){
    //     console.warn("⚠️ Você já calculou as chaves. Para escolher novos primos, exclua os dados atuais (opção 7)");
    //     return;
    // }
    estado.chavesRSA.p = primo1;
    estado.chavesRSA.q = primo2;

    estado.primosSelecionados = true;

    salvarEstado(estado);
}

const calcChaves = require('../chaves/calculo_chaves');

function atualizarChaves() {

    if (!estado.primosSelecionados) {
        console.warn("⚠️  Selecione os números primos");
        return;
    }

    //Já calculou - não será possível mudá-la novamente
    if(estado.chavesGeradas){
        console.warn("⚠️ Chaves já foram geradas");
        return;
    }

    estado.chavesRSA.n = calcChaves.acharN(estado.chavesRSA.p, estado.chavesRSA.q);
    estado.chavesRSA.coprimos = calcChaves.totiente(estado.chavesRSA.p, estado.chavesRSA.q);
    estado.chavesRSA.e = calcChaves.calcularE(estado.chavesRSA.n);
    estado.chavesRSA.d = calcChaves.acharD(estado.chavesRSA.e, estado.chavesRSA.coprimos);

    estado.chavesGeradas = true;

    salvarEstado(estado);
}

function adicionarMensagemHistorico(mensagem, criptografia) {
    if (!estado.mensagens) estado.mensagens = {};
    if (!Array.isArray(estado.mensagens.historico)) estado.mensagens.historico = [];

    const objeto = {
        mensagem: mensagem,
        criptografia: criptografia,
        chaves: {
            publica: `{${estado.chavesRSA.e},${estado.chavesRSA.n}}`,
            privada: `{${estado.chavesRSA.d},${estado.chavesRSA.n}}`,
        }
    };

    const camposValidos = objeto.mensagem != null &&
        objeto.criptografia != null;

    if (!camposValidos) {
        return;
    }

    const jaExiste = estado.mensagens.historico
        .filter(item => item != null)
        .some(item => JSON.stringify(item) === JSON.stringify(objeto));

    if (!jaExiste) {
        estado.mensagens.historico.push(objeto);
        salvarEstado(estado);
    }
}


function verHistorico() {
    if (!estado.mensagens || !Array.isArray(estado.mensagens.historico) || estado.mensagens.historico.length === 0) {
        console.warn("Histórico vazio!");
    } else {
        for (const objeto of estado.mensagens.historico) {
            console.warn(
                `\nMensagem: ${objeto.mensagem}\nCriptografia: ${objeto.criptografia}\nChave Pública: ${objeto.chaves.publica}\nChave Privada: ${objeto.chaves.privada}`
            );
        }
    }
}

function limparChaves() {
    for (let chave in estado.chavesRSA) {
        estado.chavesRSA[chave] = null;
    }

    estado.primosSelecionados = false;
    estado.chavesGeradas = false;

    salvarEstado(estado);

}

function limparMensagens() {
    for (let chave in estado.mensagens) {
        estado.mensagens[chave] = null;
    }
}

function limparEstado() {
    estado.primosSelecionados = false,
        estado.chavesGeradas = false,
        estado.mensagemEscrita = false,
        estado.criptografada = false

}

function limparDados() {
    limparChaves();
    limparMensagens();
    limparEstado();

    salvarEstado(estado);
}


module.exports = {
    estado,
    salvarEstado,
    atualizarChaves,
    atualizarMensagemAtual,
    atualizarPrimos,
    adicionarMensagemHistorico,
    verHistorico,
    limparChaves,
    limparDados
};
