const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const config = require("../config.js");

module.exports = {
    name: "setup-apply",
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.guild.name,
                iconURL: message.guild.iconURL({ format: "png" })
            })
            .setDescription(config.apply.desc)
            .setImage(config.apply.banner)
            .setColor("Random");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("apply")
                .setLabel(config.apply.name)
                .setStyle(ButtonStyle[config.apply.colorButton])
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    },
};