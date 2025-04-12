const { Events, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();
const config = require("../config.js");

const date = new Date();
const formattedDate = `<t:${Math.floor(date.getTime() / 1000)}:F>`;

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction){
        
        const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ format: "png"})
        })
        
        if(interaction.customId == "accept"){
            
            if(!interaction.member.roles.cache.has(config.staffManager)){
                return interaction.reply({
                    content: ":x: ليس لديك الصلاحية لأستخدام الأمر",
                    ephemeral: true
                })
            }
            const userId = await db.get(`application_${interaction.channel.id}`);
            if (!userId) {
                return interaction.reply({
                    content: "لا يوجد طلب مرتبط بهذا التكت.",
                    ephemeral: true
                });
            }
            
            try {
                const member = await interaction.guild.members.fetch(userId);

                await member.send(`قبول 📌

**مرحبًا،**

نود إبلاغك بأنه تم قبولك ضمن فريق إدارة السيرفر، وذلك بعد اجتيازك المقابلة الصوتية بنجاح.

نشكرك على اهتمامك ورغبتك في الانضمام للإدارة، ونتمنى لك التوفيق في أداء مهامك القادمة.

يرجى مراجعة قسم الإدارة في السيرفر للاطلاع على التعليمات والمسؤوليات.

**مع أطيب التحيات،**`);
                await member.roles.add(config.apply.staffAccept);

                await interaction.reply({
                    content: "تم قبول الشخص وتم إرسال رسالة في الخاص.",
                    ephemeral: true
                });
               

embed.setDescription(`**[قبول إداري]
العضو: <@${userId}>
الحالة: تم قبوله في الإدارة
بواسطة: <@${interaction.user.id}>
التاريخ: ${formattedDate}**`)
.setColor("Green");
                
                const log = client.channels.cache.get(config.log);
                if(!log){
                    return interaction.reply({
                        content: "لم يتم العثور على قناة اللوق"
                    })
                }
                
                await log.send({ embeds: [embed] });

            } catch (err) {
                console.error(err);
                await interaction.reply({
                    content: "حدث خطأ أثناء محاولة قبول المستخدم.",
                    ephemeral: true
                });
            }
        } else if(interaction.customId == "reject"){
            
            if(!interaction.member.roles.cache.has(config.staffManager)){
                return interaction.reply({
                    content: ":x: ليس لديك الصلاحية لأستخدام الأمر",
                    ephemeral: true
                })
            }
            const userId = await db.get(`application_${interaction.channel.id}`);
            if (!userId) {
                return interaction.reply({
                    content: "لا يوجد طلب مرتبط بهذا التكت.",
                    ephemeral: true
                });
            }
            
            try {
                const member = await interaction.guild.members.fetch(userId);

                await member.send(`رفض📌
**مرحبًا،**

نشكرك على تقديمك للانضمام إلى فريق الإدارة وعلى مشاركتك في المقابلة الصوتية.

نود إبلاغك بأنه **لم يتم قبولك في الوقت الحالي.**
هذا لا يعني أنك غير مؤهل، ولكننا نبحث عن معايير محددة تتناسب مع متطلبات المرحلة الحالية.

نأمل أن لا يؤثر ذلك على تفاعلك معنا في السيرفر، وقد تتاح فرص مستقبلية جديدة للانضمام.

**مع خالص التقدير،**`);

                await interaction.reply({
                    content: "تم رفض الشخص وتم إرسال رسالة في الخاص.",
                    ephemeral: true
                });
                
                embed.setDescription(`**[رفض طلب إدارة]
العضو: <@${userId}>
الحالة: لم يتم قبوله
بواسطة: <@${interaction.user.id}>
التاريخ: ${formattedDate}
الملاحظات: لم يستوفِ بعض الشروط المطلوبة حاليًا.**`)
.setColor("Red");
                
                const log = client.channels.cache.get(config.log);
                if(!log){
                    return interaction.reply({
                        content: "لم يتم العثور على قناة اللوق"
                    })
                }
                
                await log.send({ embeds: [embed] });

            } catch (err) {
                console.error(err);
                await interaction.reply({
                    content: "حدث خطأ أثناء محاولة قبول المستخدم.",
                    ephemeral: true
                });
            }
        } else if(interaction.customId == "close"){
    
        const modal = new ModalBuilder()
        .setCustomId("modall")
        .setTitle("Close Ticket");
        
        const reasons = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Reason")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
        
        const row = new ActionRowBuilder()
        .addComponents(reasons);
        
        modal.addComponents(row);
        await interaction.showModal(modal);
}
    },
};
