require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- MAPEAMENTO COMPLETO (6 COLUNAS X 8 LINHAS) ---
const tabelas = {
    Azul: [
        ["D4", "B2", "C2", "A3", "C1", "B3"], // Dado 1
        ["A2", "A4", "D3", "A1", "C3", "D1"], // Dado 2
        ["C3", "D3", "A2", "B1", "A3", "C4"], // Dado 3
        ["B3", "D2", "B1", "D4", "A4", "A1"], // Dado 4
        ["D2", "A2", "C2", "A3", "B3", "B1"], // Dado 5
        ["A1", "B4", "A4", "B2", "C3", "C2"], // Dado 6
        ["D3", "B4", "C1", "D4", "C1", "C4"], // Dado 7
        ["B4", "C4", "B2", "D2", "D1", "D1"]  // Dado 8
    ],
    Vermelha: [
        ["B4", "C2", "D3", "D1", "A3", "B2"], // Dado 1
        ["D4", "B4", "C4", "B3", "A2", "D1"], // Dado 2
        ["D2", "B2", "A4", "A2", "D3", "D4"], // Dado 3
        ["C3", "A1", "B1", "A3", "D4", "A4"], // Dado 4
        ["C4", "C1", "B2", "C3", "B1", "A1"], // Dado 5
        ["A4", "D1", "C2", "C4", "A2", "C2"], // Dado 6
        ["D2", "B3", "C1", "B3", "B1", "A1"], // Dado 7
        ["D3", "B4", "A3", "C1", "D2", "C3"]  // Dado 8
    ]
};

let jogoAtual = { cor: null, baralho: [], proximaCarta: 0 };
let cartasAtribuidas = new Map();

const commands = [
    new SlashCommandBuilder()
        .setName('iniciar')
        .setDescription('Inicia uma rodada de Infiltrados (Visão Total)')
        .addStringOption(opt => opt.setName('cor').setDescription('Cor da cartela').setRequired(true).addChoices(
            { name: 'Azul', value: 'Azul' },
            { name: 'Vermelha', value: 'Vermelha' }
        ))
        .addIntegerOption(opt => opt.setName('jogadores').setDescription('Total de pessoas').setRequired(true))
].map(command => command.toJSON());

client.once('ready', async () => {
    console.log(`✅ Bot online: ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'iniciar') {
        const cor = interaction.options.getString('cor');
        const qtd = interaction.options.getInteger('jogadores');

        jogoAtual = { cor, proximaCarta: 0 };
        cartasAtribuidas.clear();

        let papeis = [];
        const infiltrado = Math.floor(Math.random() * qtd);
        for (let i = 0; i < qtd; i++) papeis.push(i === infiltrado ? 'INFILTRADO' : 'AGENTE');
        for (let i = papeis.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [papeis[i], papeis[j]] = [papeis[j], papeis[i]];
        }
        jogoAtual.baralho = papeis;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('card').setLabel('Pegar minha Função 🃏').setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: `🎮 **CARTELA ${cor.toUpperCase()} NA MESA!**\n\nTodos cliquem no botão. O Host mostrará o painel de palavras e rolará o dado!`,
            components: [row]
        });
    }

    if (interaction.isButton() && interaction.customId === 'card') {
        if (!cartasAtribuidas.has(interaction.user.id)) {
            if (jogoAtual.proximaCarta >= jogoAtual.baralho.length) return interaction.reply({ content: "Mesa cheia!", ephemeral: true });
            cartasAtribuidas.set(interaction.user.id, jogoAtual.baralho[jogoAtual.proximaCarta++]);
        }

        const papel = cartasAtribuidas.get(interaction.user.id);
        
        if (papel === 'INFILTRADO') {
            await interaction.reply({
                content: `🕵️ **VOCÊ É O INFILTRADO!**\n\nVocê não tem acesso à tabela. Tente descobrir a palavra secreta observando os outros!`,
                ephemeral: true
            });
        } else {
            const grade = tabelas[jogoAtual.cor];
            let tabelaFinal = "```\n";
            tabelaFinal += `      CARTELA ${jogoAtual.cor.toUpperCase()} (COLUNAS 1-6)\n`;
            tabelaFinal += "      1   2   3   4   5   6\n";
            tabelaFinal += "-------------------------------------\n";
            
            grade.forEach((linha, i) => {
                tabelaFinal += `D${i+1} | ` + linha.join("  ") + "\n";
            });
            
            tabelaFinal += "-------------------------------------\n```";

            await interaction.reply({
                content: `✅ **VOCÊ É UM AGENTE.**\n\nAqui está sua visão da cartela:\n${tabelaFinal}\n*Localize a coordenada conforme o dado que cair na câmera!*`,
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);