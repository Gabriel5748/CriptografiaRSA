module.exports = {
  p: null,
  q: null,
  e: null,
  d: null,
  n: null,
  chaves: {
    publica: `{ ${this.e} , ${this.n} }`,
    privada: `{ ${this.d} , ${this.n} }`
  },

  coprimos: null,
  mensagemInput: '',
  mensagemCriptografada: '',
  mensagemDescriptografada: ''
};