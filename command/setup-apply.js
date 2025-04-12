const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const config = require("../config.js");
const fs = require("fs");
const path = require("path");
const statusPath = path.join(__dirname, "../applyStatus.json");

function readApplyStatus() {
    const data = fs.readFileSync(statusPath, "utf8");
    return JSON.parse(data).open;
}

module.exports = {
    name: "setup-apply",
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        const isApplyOpen = readApplyStatus();
        
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
                .setStyle(ButtonStyle[config.apply.colorButton]),
            new ButtonBuilder()
                .setCustomId("status")
                .setEmoji(isApplyOpen ? config.apply.emojiOpen : config.apply.emojiClosed)
                .setStyle(ButtonStyle.Secondary)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    },
};
