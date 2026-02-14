🕵️ Bot Infiltrados para Discord
Este projeto é um bot para Discord desenvolvido em Node.js com a biblioteca discord.js. Ele foi criado para permitir que o jogo de tabuleiro físico "Infiltrados" seja jogado online com amigos, resolvendo o desafio de distribuir papéis e coordenadas secretas sem que ninguém (nem mesmo o host) saiba quem é o infiltrado.

🚀 Funcionalidades
Distribuição Sigilosa: Utiliza mensagens efêmeras (visíveis apenas para quem clica) para garantir que cada jogador conheça seu papel em segredo absoluto.

Emulação de Baralho Físico: Sorteia e embaralha os papéis de "Agente" e "Infiltrado" antes de cada rodada.

Acesso à Cartela: Agentes recebem uma tabela formatada baseada nas coordenadas das cartelas físicas (Azul e Vermelha), permitindo a consulta rápida durante a partida.

Suporte Multi-Jogador: Configurável para diferentes quantidades de jogadores, adaptando-se ao tamanho do seu grupo.

🛠️ Tecnologias Utilizadas
JavaScript (Node.js)

Discord.js v14

Dotenv (para segurança das chaves de API)

📖 Como Jogar
O host usa o comando /iniciar informando a cor da cartela física e o número de jogadores.

Os jogadores clicam no botão para "Retirar Carta".

O bot informa em segredo se o jogador é um Agente ou o Infiltrado.

O host mostra a cartela física na câmera e rola o dado; os agentes consultam suas tabelas privadas enviadas pelo bot para encontrar a palavra-chave.
