# Criptografia RSA

Este projeto é um trabalho desenvolvido para a disciplina de Segurança da Informação do 5º semestre do curso de Análise e Desenvolvimento de Sistemas da FATEC Ribeirão Preto.

## Sobre o Projeto

O programa implementa um sistema de criptografia RSA puro em Python, sem o uso de bibliotecas externas de criptografia. Ele permite que usuários escrevam mensagens em arquivos de texto e as criptografem usando o algoritmo RSA, além de descriptografar mensagens previamente criptografadas.

## Funcionalidades

- Escrever mensagens em arquivos
- Criptografar mensagens usando RSA
- Descriptografar mensagens usando RSA
- Visualizar lista de mensagens (criptografadas e descriptografadas)
- Sistema de senha para proteger as operações
- Alterar senha do sistema
- Limpar todas as mensagens

## Como Executar

### Pré-requisitos
- Python 3.x instalado

### Executando o programa
1. Clone este repositório:
```bash
git clone https://github.com/isthedede/Criptografia-SEG-INF.git
```

2. Entre na pasta do projeto:
```bash
cd Criptografia-SEG-INF
```

3. Execute o programa:
```bash
python criptografa.py
```

## Como Usar

1. Ao iniciar o programa, você verá um menu com as seguintes opções:
   - 1: Escrever nova mensagem
   - 2: Criptografar mensagem
   - 3: Descriptografar mensagem
   - 4: Ver mensagens armazenadas
   - 5: Alterar senha
   - 6: Limpar todas as mensagens
   - 7: Sair

2. A senha inicial do sistema é "123"

### Fluxo básico de uso:

1. Escolha opção 1 para escrever uma nova mensagem
   - Digite um ID para a mensagem (ex: "1")
   - Digite o conteúdo da mensagem

2. Escolha opção 2 para criptografar
   - Digite o ID da mensagem que deseja criptografar
   - Digite a senha do sistema

3. Escolha opção 3 para descriptografar
   - Digite o ID da mensagem criptografada
   - Digite a senha do sistema

4. Use a opção 4 para ver todas as mensagens armazenadas e seus estados (criptografadas ou descriptografadas)

### Observações

- As mensagens são salvas como arquivos .txt (descriptografadas) ou .enc (criptografadas)
- O sistema gera automaticamente as chaves RSA na primeira execução
- A senha é necessária para operações de criptografia e descriptografia
- Para maior segurança, recomenda-se alterar a senha padrão "123"

## Implementação Técnica

O programa implementa o RSA "puro", realizando:
- Geração de números primos
- Cálculo de chaves pública e privada
- Criptografia/descriptografia usando exponenciação modular
- Armazenamento seguro das chaves

## Autores

- André Luiz Toyama Zanello
- Gabriel Felipe dos Reis Martins
- Júlia Rocha
- Samira Pedreira
