const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config.js");
const fs = require("fs");
const path = require("path");
const statusPath = path.join(__dirname, "../applyStatus.json");

function readApplyStatus() {
    const data = fs.readFileSync(statusPath, "utf8");
    return JSON.parse(data).open;
}

function writeApplyStatus(newStatus) {
    fs.writeFileSync(statusPath, JSON.stringify({ open: newStatus }, null, 2));
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction){
        
        if(interaction.customId == "status"){
        
        const isApplyOpen = readApplyStatus();
        const newStatus = !isApplyOpen;

        writeApplyStatus(newStatus);

        const emoji = newStatus ? config.apply.emojiOpen : config.apply.emojiClosed;
        if(!interaction.member.roles.cache.has(config.staffManager)){
                return interaction.reply({
                    content: ":x: ليس لديك الصلاحية لأستخدام هذا الزر",
                    ephemeral: true
                })
            }
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("apply")
                .setLabel(config.apply.name)
                .setStyle(ButtonStyle[config.apply.colorButton]),
            new ButtonBuilder()
                .setCustomId("status")
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Secondary)
        );
            await interaction.message.edit({ components: [row] });
            await interaction.reply({
                content: "تم تغير حالة التقديم بنجاح.",
                ephemeral: true
            })
        }
    },
};
