const { Events, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();
const config = require("../config.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "applicationModal") return;

        const userId = interaction.user.id;
        const Q1 = interaction.fields.getTextInputValue("Q1");
        const Q2 = interaction.fields.getTextInputValue("Q2");
        const Q3 = interaction.fields.getTextInputValue("Q3");
        const Q4 = interaction.fields.getTextInputValue("Q4");
        const Q5 = interaction.fields.getTextInputValue("Q5");


        const channel = await interaction.guild.channels.create({
            name: `apply-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: config.category,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: userId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
                {
                    id: interaction.guild.members.me.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels],
                },
                {
                    id: config.staffManager,
                    allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
            ],
                },
            ],
        });

        const embed = new EmbedBuilder()
        .setAuthor({
    name: interaction.user.username,
    iconURL: interaction.user.displayAvatarURL({ format: "png" })
})
            .setDescription(`**${config.apply.q1} :\n${Q1}\n${config.apply.q2} :\n${Q2}\n${config.apply.q3} :\n${Q3}\n${config.apply.q4} :\n${Q4}\n${config.apply.q5} :\n${Q5}**`)
            .setColor("Random");

        const acceptButton = new ButtonBuilder()
            .setCustomId("accept")
            .setLabel("قبول")
            .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
            .setCustomId("reject")
            .setLabel("رفض")
            .setStyle(ButtonStyle.Danger);

        const closeButton = new ButtonBuilder()
            .setCustomId("close")
            .setLabel("اغلاق التذكرة")
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton, closeButton);
        
        await db.set(`application_${channel.id}`, interaction.user.id);

        await channel.send({
            content: `<@${userId}>`,
            embeds: [embed],
            components: [row],
        });

        await interaction.reply({ content: `Ticket has been created ${channel}`, ephemeral: true });
    },
};