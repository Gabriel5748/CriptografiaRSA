const fs = require('fs');
const path = './chavesRSA.json';

// Lê o arquivo JSON
function lerEstado() {
    const dados = fs.readFileSync(path, 'utf-8');
    return JSON.parse(dados);
}

const estado = lerEstado();

// Salva os dados de volta no arquivo JSON
function salvarEstado(dados) {
    fs.writeFileSync(path, JSON.stringify(dados, null, 4), 'utf-8');
}

// Modificando o estado
function atualizarChaves(chavePublica, chavePrivada, n) {
    estado.chavesRSA.e = chavePublica;
    estado.chavesRSA.d = chavePrivada;
    estado.chavesRSA.n = n;

    //Deve ter um jeito melhor, mas por enquanto ta bom
    estado.chavesRSA.chave_publica = `{ ${chavePublica} , ${n} }`;
    estado.chavesRSA.chave_privada = `{ ${chavePrivada} , ${n} }`;

    salvarEstado(estado);
    console.warn("🔐 Chaves atualizadas!");
}

function atualizarMensagemAtual(mensagem) {


    estado.mensagens.mensagem_atual = mensagem;

    salvarEstado(estado);
}

function atualizarPrimos(primo1, primo2) {
    estado.chavesRSA.p = primo1;
    estado.chavesRSA.q = primo2;

    salvarEstado(estado);
}

function atualizarCoprimos(coprimos) {
    estado.chavesRSA.coprimos = coprimos;

    salvarEstado(estado);
}

function adicionarMensagemHistorico(mensagem, criptografia) {
    if (!mensagem || !criptografia) {
        console.warn("Mensagem ou criptografia inválida. Nada foi salvo.");
        return;
    }

    if (!estado.mensagens) estado.mensagens = { historico: [] };
    if (!Array.isArray(estado.mensagens.historico)) estado.mensagens.historico = [];

    const objeto = {
        mensagem: mensagem,
        criptografia: criptografia,
        chaves: {
            publica: estado.chavesRSA.chave_publica,
            privada: estado.chavesRSA.chave_privada,
        }
    };

    if (estado.mensagens.historico.some(item =>
        JSON.stringify(item) === JSON.stringify(objeto)
    )) {
        return;
    } else {
        estado.mensagens.historico.push(objeto);
    }

    salvarEstado(estado);
}


function verHistorico() {
    if (!estado.mensagens || !Array.isArray(estado.mensagens.historico) || estado.mensagens.historico.length === 0) {
        console.warn("Histórico vazio!");
    } else {
        for (const objeto of estado.mensagens.historico) {
            console.log(`Mensagem: ${objeto.mensagem}, Criptografia: ${objeto.criptografia}`);
        }
    }
}

function limparDados() {
    for (let chave in estado.chavesRSA) {
        estado.chavesRSA[chave] = null;
    }

    for (let chave in estado.mensagens) {
        estado.mensagens[chave] = null;
    }
    salvarEstado(estado);
}


module.exports = { atualizarChaves, atualizarMensagemAtual, atualizarPrimos, atualizarCoprimos, adicionarMensagemHistorico, verHistorico, limparDados };
