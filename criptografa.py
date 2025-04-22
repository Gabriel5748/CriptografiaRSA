import os
import re
import random
import math

SENHA_ATUAL = "123"

PUBLIC_KEY_FILE = "public_key.txt"
PRIVATE_KEY_FILE = "private_key.txt"

def mdc(a, b):
    while b:
        a, b = b, a % b
    return a

def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('Inverso modular não existe')
    else:
        return x % m

def eh_primo(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(n ** 0.5) + 1, 2):
        if n % i == 0:
            return False
    return True

def gerar_primo(bits=16):
    while True:
        p = random.randrange(2**(bits-1), 2**bits)
        if eh_primo(p):
            return p

def gerar_chaves_rsa():
    if os.path.exists(PUBLIC_KEY_FILE) and os.path.exists(PRIVATE_KEY_FILE):
        return
    bits = 16  # Para testes didáticos
    p = gerar_primo(bits)
    q = gerar_primo(bits)
    while q == p:
        q = gerar_primo(bits)
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 65537
    while mdc(e, phi) != 1:
        e = random.randrange(3, phi, 2)
    d = modinv(e, phi)
    with open(PUBLIC_KEY_FILE, 'w') as f:
        f.write(f"{e},{n}")
    with open(PRIVATE_KEY_FILE, 'w') as f:
        f.write(f"{d},{n}")

def carregar_chave_publica():
    with open(PUBLIC_KEY_FILE, 'r') as f:
        e, n = f.read().split(',')
        return int(e), int(n)

def carregar_chave_privada():
    with open(PRIVATE_KEY_FILE, 'r') as f:
        d, n = f.read().split(',')
        return int(d), int(n)

def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

def validar_forca_senha(senha):
    if len(senha) < 8:
        return False, "A senha deve ter pelo menos 8 caracteres."
    if not re.search(r"[A-Z]", senha):
        return False, "A senha deve conter pelo menos uma letra maiúscula."
    if not re.search(r"[a-z]", senha):
        return False, "A senha deve conter pelo menos uma letra minúscula."
    if not re.search(r"[0-9]", senha):
        return False, "A senha deve conter pelo menos um número."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", senha):
        return False, "A senha deve conter pelo menos um caractere especial."
    return True, "Senha válida."

def verificar_senha():
    senha = input("Digite a senha: ")
    return senha == SENHA_ATUAL

def escrever_mensagem():
    id = input("Digite o ID da mensagem: ")
    mensagem = input("Digite a mensagem: ")
    with open(f"{id}.txt", "w") as arquivo:
        arquivo.write(mensagem)
    print("\nMensagem salva com sucesso!")

def criptografar():
    gerar_chaves_rsa()
    id = input("Digite o ID da mensagem para criptografar: ")
    try:
        with open(f"{id}.txt", "r") as arquivo:
            mensagem = arquivo.read()
    except FileNotFoundError:
        print("\nErro: Mensagem não encontrada!")
        return
    if not verificar_senha():
        print("\nErro: Senha incorreta!")
        return
    e, n = carregar_chave_publica()
    msg_ints = [ord(char) for char in mensagem]
    cifrado = [str(pow(m, e, n)) for m in msg_ints]
    with open(f"{id}.enc", "w") as arquivo:
        arquivo.write(' '.join(cifrado))
    os.remove(f"{id}.txt")
    print("\nMensagem criptografada com sucesso!")

def descriptografar():
    gerar_chaves_rsa()
    id = input("Digite o ID da mensagem para descriptografar: ")
    try:
        with open(f"{id}.enc", "r") as arquivo:
            texto_cifrado = arquivo.read().strip().split()
    except FileNotFoundError:
        print("\nErro: Mensagem criptografada não encontrada!")
        return
    if not verificar_senha():
        print("\nErro: Senha incorreta!")
        return
    d, n = carregar_chave_privada()
    try:
        msg_ints = [pow(int(c), d, n) for c in texto_cifrado]
        mensagem = ''.join([chr(m) for m in msg_ints])
    except Exception as e:
        print(f"\nErro ao descriptografar: {e}")
        return
    with open(f"{id}.txt", "w") as arquivo:
        arquivo.write(mensagem)
    os.remove(f"{id}.enc")
    print("\nMensagem descriptografada com sucesso!")

def alterar_senha():
    global SENHA_ATUAL
    print("\n=== Alterar Senha ===")
    if not verificar_senha():
        print("\nErro: Senha atual incorreta!")
        return
    nova_senha = input("\nDigite a nova senha: ")
    confirmar_senha = input("Confirme a nova senha: ")
    if nova_senha != confirmar_senha:
        print("\nErro: As senhas não coincidem!")
        return
    valida, mensagem = validar_forca_senha(nova_senha)
    if not valida:
        print(f"\nErro: {mensagem}")
        return
    SENHA_ATUAL = nova_senha
    print("\nSenha alterada com sucesso!")

def limpar_todas_mensagens():
    confirmacao = input("Tem certeza que deseja apagar todas as mensagens? (s/n): ").lower()
    if confirmacao != 's':
        print("Operação cancelada.")
        return
    for arquivo in os.listdir():
        if arquivo.endswith(".txt") or arquivo.endswith(".enc"):
            os.remove(arquivo)
    print("Todas as mensagens foram removidas com sucesso!")

def ver_mensagens():
    limpar_tela()
    print("=== Mensagens Armazenadas ===")
    print("{:<10} {:<15}".format("ID", "Status"))
    print("-" * 25)
    for arquivo in os.listdir():
        if arquivo.endswith(".txt"):
            status = "Descriptografada"
            id = arquivo[:-4]
        elif arquivo.endswith(".enc"):
            status = "Criptografada"
            id = arquivo[:-4]
        else:
            continue
        print("{:<10} {:<15}".format(id, status))
    print("=" * 25)

def menu():
    while True:
        print("\n=== Menu Principal ===")
        print("1. Escrever nova mensagem")
        print("2. Criptografar mensagem")
        print("3. Descriptografar mensagem")
        print("4. Ver mensagens armazenadas")
        print("5. Alterar senha")
        print("6. Limpar todas as mensagens")
        print("7. Sair")
        opcao = input("\nEscolha uma opção: ")
        if opcao == '1':
            limpar_tela()
            escrever_mensagem()
        elif opcao == '2':
            limpar_tela()
            criptografar()
        elif opcao == '3':
            limpar_tela()
            descriptografar()
        elif opcao == '4':
            ver_mensagens()
        elif opcao == '5':
            limpar_tela()
            alterar_senha()
        elif opcao == '6':
            limpar_tela()
            limpar_todas_mensagens()
        elif opcao == '7':
            print("\nSaindo do programa...")
            break
        else:
            print("\nOpção inválida!")

if __name__ == "__main__":
    limpar_tela()
    menu()
