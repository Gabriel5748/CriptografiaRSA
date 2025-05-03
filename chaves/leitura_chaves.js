const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '..', 'chavesRSA.json');
const dados = fs.readFileSync(arquivo, 'utf-8');
const estado = JSON.parse(dados);

// Salva os dados de volta no arquivo JSON
function salvarEstado(dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 4), 'utf-8');
}

// Modificando o estado
function atualizarChaves(chavePublica, chavePrivada, n,coprimos) {
    if(!estado.primosSelecionados){
        console.warn("⚠️  Selecione os números primos");
        return;
    }

    if(!estado.chavesGeradas){
        estado.chavesRSA.e = chavePublica;
        estado.chavesRSA.d = chavePrivada;
        estado.chavesRSA.n = n;
        estado.chavesRSA.coprimos = coprimos;
    
        //Deve ter um jeito melhor, mas por enquanto ta bom
        estado.chavesRSA.chave_publica = `{ ${chavePublica} , ${n} }`;
        estado.chavesRSA.chave_privada = `{ ${chavePrivada} , ${n} }`;
    
        estado.chavesGeradas = true;
    
        salvarEstado(estado);
        console.warn("🔐 Chaves atualizadas!");
    } else{
        console.warn("⚠️ Chaves já foram geradas");
    }

}

function atualizarMensagemAtual(mensagem) {


    estado.mensagens.mensagem_atual = mensagem;

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

function adicionarMensagemHistorico(mensagem, criptografia) {
    if (!estado.mensagens) estado.mensagens = { historico: [] };
    if (!Array.isArray(estado.mensagens.historico)) estado.mensagens.historico = [];
    if(!estado.mensagemEscrita){
        return;
    }
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
            console.log(
                `\nMensagem: ${objeto.mensagem}\nCriptografia: ${objeto.criptografia}\nChave Pública: ${objeto.chaves.publica}\nChave Privada: ${objeto.chaves.privada}`
            );
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

    estado.primosSelecionados = false,
    estado.chavesGeradas = false,
    estado.mensagemEscrita = false,
    estado.criptografada = false

    salvarEstado(estado);
}


module.exports = { estado,atualizarChaves, atualizarMensagemAtual, atualizarPrimos,adicionarMensagemHistorico, verHistorico, limparDados };
