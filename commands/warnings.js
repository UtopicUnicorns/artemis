const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'warnings',
    description: '[mod] Look up user warning',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
        if (!message.member.permissions.has('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('warnings');
        usage.number++;
        setUsage.run(usage);
        //
        const user = message.mentions.users.first();
        if (!user) {
            const getstuff = db.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY warning DESC LIMIT 24;").all(message.guild.id);
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM');
            for (const data of getstuff) {
                if (message.guild.members.cache.get(data.user) && data.warning > 0) {
                    let user = message.guild.members.cache.get(data.user);
                    embed.addField(user.user.username, `Warnings: ${data.warning} | Reason: ${data.notes}`);
                }
            }
            message.channel.send({
                embed
            });
        }
        const userscore = getScore.get(user.id, message.guild.id);
        if (!userscore) return message.reply("This user has no entry!");
        if (userscore.muted == `1`) {
            var isMuted = 'yes';
        } else {
            var isMuted = 'no'
        }
        if (message.content.includes("reset")) {
            userscore.warning = 0;
            setScore.run(userscore);
            return message.channel.send("Warnings for this user have been reset to 0!");
        }
        const embeds = new Discord.MessageEmbed()
            .setAuthor(user.username, user.displayAvatarURL({ format: 'jpg' }))
            .setDescription(user)
            .setColor('RANDOM')
            .addField('Warnings: ', userscore.warning)
            .addField('Latest reason: ', userscore.notes)
            .addField('Muted? ', isMuted)
            .setFooter(user.id)
        message.channel.send({
            embed: embeds
        });

    }
};