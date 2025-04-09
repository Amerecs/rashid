const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const config = require("../config.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (interaction.customId === "apply") {
            const modal = new ModalBuilder()
                .setCustomId("applicationModal")
                .setTitle("Apply");

            const question1 = new TextInputBuilder()
                .setCustomId("Q1")
                .setLabel(config.apply.q1)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const question2 = new TextInputBuilder()
                .setCustomId("Q2")
                .setLabel(config.apply.q2)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const question3 = new TextInputBuilder()
                .setCustomId("Q3")
                .setLabel(config.apply.q3)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const question4 = new TextInputBuilder()
                .setCustomId("Q4")
                .setLabel(config.apply.q4)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const question5 = new TextInputBuilder()
                .setCustomId("Q5")
                .setLabel(config.apply.q5)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const row1 = new ActionRowBuilder().addComponents(question1);
            const row2 = new ActionRowBuilder().addComponents(question2);
            const row3 = new ActionRowBuilder().addComponents(question3);
            const row4 = new ActionRowBuilder().addComponents(question4);
            const row5 = new ActionRowBuilder().addComponents(question5);

            modal.addComponents(row1, row2, row3, row4, row5);

            await interaction.showModal(modal);
        }
    },
};