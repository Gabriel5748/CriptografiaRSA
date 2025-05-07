const rsaState = require('./rsa_state');

module.exports = {
  podeCriptografar: () => {
    return rsaState.temPrimosSelecionados() && 
           rsaState.temChavesGeradas() && 
           rsaState.temMensagemEscrita() && 
           !rsaState.estaCriptografada();
  },

  podeDescriptografar: () => {
    return rsaState.temChavesGeradas() && 
           rsaState.estaCriptografada();
  },

  podeGerarChaves: () => {
    return rsaState.temPrimosSelecionados() && 
           !rsaState.temChavesGeradas();
  },

  validarPrimo: (num) => {
    if (typeof num !== 'number' || !Number.isInteger(num) || num <= 1) {
      return false;
    }
    // Implementação da verificação de número primo
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
      if (num % i === 0) return false;
    }
    return true;
  },

  validarMensagem: (mensagem) => {
    return typeof mensagem === 'string' && mensagem.length > 0;
  }
};