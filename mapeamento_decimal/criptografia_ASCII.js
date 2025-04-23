//Não é o recomendado, pois já é uma criptografia manjada
// Função para criptografarRSA (transformar letra em número ASCII)

//VOLTAR AQUI DEPOIS 


// function criptografarASCII(mensagem) {
//     let resultado = '';
//     for (let i = 0; i < mensagem.length; i++) {
//         //Pega o valor da tabela ASCII
//         let valorASCII = mensagem.charCodeAt(i);
//         resultado += valorASCII + ' ';
//     }

//     return resultado.trim();
// }

// function descriptografarASCII(mensagemC) {
//     let resultado = '';
//     let valorASCII = mensagemC.split(' ');
//     for (let i = 0; i < valorASCII.length; i++) {
//         let char = String.fromCharCode(parseInt(valorASCII[i]));
//         resultado += char;
//     }
//     return resultado;
// }

// module.exports = {criptografarASCII,descriptografarASCII}