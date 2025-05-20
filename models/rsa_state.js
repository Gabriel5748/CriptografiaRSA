// RSAState.js
const fs = require('fs');
const path = require('path');
const { calcularE, totiente, acharD, acharN } = require('../chaves/calculo_chaves');

class RSAState {
  constructor() {
    this.arquivo = path.join(__dirname, '..', 'chavesRSA.json');
    this.carregarEstado();
  }


  carregarEstado() {
    try {
      const dados = fs.readFileSync(this.arquivo, 'utf-8');
      this.estado = JSON.parse(dados);
    } catch (error) {
      this.estado = {
        chavesRSA: {
          p: null,
          q: null,
          n: null,
          e: null,
          d: null,
          coprimos: null
        },
        mensagens: {
          mensagem_atual: null,
          historico: []
        },
        primosSelecionados: false,
        chavesGeradas: false,
        mensagemEscrita: false,
        criptografada: false
      };
      this.salvarEstado();
    }
  }

  salvarEstado() {
    fs.writeFileSync(this.arquivo, JSON.stringify(this.estado, null, 2), 'utf-8');
  }

  temPrimosSelecionados() {
    return this.estado.primosSelecionados;
  }

  temChavesGeradas() {
    return this.estado.chavesGeradas;
  }

  temMensagemEscrita() {
    return this.estado.mensagemEscrita;
  }

  estaCriptografada() {
    return this.estado.criptografada;
  }

  atualizarPrimos(p, q) {
    this.estado.chavesRSA.p = p;
    this.estado.chavesRSA.q = q;
    this.estado.primosSelecionados = true;
    this.salvarEstado();
  }

  atualizarMensagemAtual(mensagem) {
    this.estado.mensagens.mensagem_atual = mensagem;
    this.estado.mensagemEscrita = true;
    this.salvarEstado();
  }

  atualizarChaves() {
    if (!this.temPrimosSelecionados()) {
      throw new Error("Primos não selecionados");
    }

    this.estado.chavesRSA.n = acharN(this.estado.chavesRSA.p, this.estado.chavesRSA.q);
    this.estado.chavesRSA.coprimos = totiente(this.estado.chavesRSA.p, this.estado.chavesRSA.q);
    this.estado.chavesRSA.e = calcularE(this.estado.chavesRSA.coprimos);
    this.estado.chavesRSA.d = acharD(this.estado.chavesRSA.e, this.estado.chavesRSA.coprimos);
    this.estado.chavesGeradas = true;
    this.salvarEstado();
  }

  adicionarMensagemHistorico(mensagem, criptografia) {
    if (!mensagem || mensagem.trim() === '') return;

    const chavesRSA = this.estado.chavesRSA;
    const chavesValidas = chavesRSA && chavesRSA.e != null && chavesRSA.d != null && chavesRSA.n != null;

    if (!chavesValidas) {
      return;
    }

    let objeto = {
      mensagem: mensagem,
      criptografia: criptografia,
      chaves: {
        publica: `${this.estado.chavesRSA.e}, ${this.estado.chavesRSA.n}`,
        privada: `${this.estado.chavesRSA.d}, ${this.estado.chavesRSA.n}`
      }
    }

    const camposValidos = objeto.mensagem != null &&
      objeto.criptografia != null;

    if (!camposValidos) {
      return;
    }


    const historico = this.estado.mensagens.historico;

    const jaExiste = historico.filter(item => item != null)
      .some(item => JSON.stringify(item) === JSON.stringify(objeto));

    if (!jaExiste) {
      historico.push(objeto);
      this.salvarEstado();
    }
  }

  excluirHistorico() {
    this.estado.mensagens.historico = [];
    this.salvarEstado();
  }

  verHistorico() {
    if (!this.estado.mensagens.historico || this.estado.mensagens.historico.length === 0) {
      console.warn("Histórico vazio. Nenhuma mensagem foi processada ainda.");
      return;
    }

    console.warn("\n=== HISTÓRICO DE MENSAGENS ===");
    this.estado.mensagens.historico.forEach((item, index) => {
      console.warn(`\n[Registro ${index + 1}]`);
      console.warn(`📝 Mensagem original: ${item.mensagem || 'N/A'}`);
      console.warn(`🔒 Mensagem criptografada: ${item.criptografia || 'N/A'}`);
      console.warn(`🔑 Chave pública usada: ${item.chaves?.publica || 'N/A'}`);
      console.warn(`🔐 Chave privada usada: ${item.chaves?.privada || 'N/A'}`);
      console.warn("─".repeat(50));
    });
  }


  limparChaves() {
    this.estado.chavesRSA = {
      p: null,
      q: null,
      n: null,
      e: null,
      d: null,
      coprimos: null
    };

    this.estado.primosSelecionados = false;
    this.estado.chavesGeradas = false;
    this.estado.criptografada = false;

    this.salvarEstado();

  }

  limparDados() {
    this.estado = {
      chavesRSA: {
        p: null,
        q: null,
        n: null,
        e: null,
        d: null,
        coprimos: null
      },
      mensagens: {
        mensagem_atual: null,
        historico: []
      },
      primosSelecionados: false,
      chavesGeradas: false,
      mensagemEscrita: false,
      criptografada: false
    };
    this.salvarEstado();
  }
}


module.exports = new RSAState();