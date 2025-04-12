const { Events, EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction){
        
        if (!interaction.isModalSubmit() || interaction.customId !== "modall") return;

        const reason = interaction.fields.getTextInputValue("reason");
        
        const userId = await db.get(`application_${interaction.channel.id}`);
        
        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setTitle("**Ticket Closed**")
            .addFields(
                { name: "**Opened By**", value: `<@${userId}>`, inline: true },
                { name: "**Closed By**", value: `<@${interaction.user.id}>`, inline: true },
                { name: "**Open Time**", value: `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:F>`, inline: true },
                { name: "**Close Time**", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
{ name: "**Close Reason**", value: reason || "No reason provided", inline: false }
            );
        
        const logChannel = client.channels.cache.get(config.log);
        if (logChannel) {
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }


        try {
            const member = await interaction.guild.members.fetch(userId);
            await member.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Could not DM the ticket owner (${ownerId}):`, error);
        }
        
        await interaction.reply({
            content: "The ticket has will be deleted in 5 seconds."
        });
        
        setTimeout(() => {
            interaction.channel.delete();
        }, 5000);
        
    },
};
