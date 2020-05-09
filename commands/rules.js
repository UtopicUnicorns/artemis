const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'rules',
    description: '[mod] Show rules',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (!message.member.permissions.has('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('rules');
        usage.number++;
        setUsage.run(usage);
        //
        let embed = new Discord.MessageEmbed()
            .setTitle('Server Rules')
            .setColor(`RANDOM`)
            .setThumbnail(message.guild.iconURL({ format: 'jpg' }))
            .addField('(1)\n', 'Hatespeech by the means of messaging or usernames is forbidden.')
            .addField('(2)\n', 'No spamming. No exceptions!')
            .addField('(3)\n', 'Gore, nudity and general NSFW content is forbidden!')
            .addField('(4)\n', 'Do not be a dick, be reasonable.')
            .addField('(5)\n', 'Use the appropriate channels.')
            .addField('(6)\n', 'No selfbots or regular bots, we already have a proper bot here.')
            .addField('(7)\n', 'Extensive cursing is forbidden.')
            .addField('(8)\n', 'Spreading personal info from yourself or someone else even with consent is strictly forbidden!')
            .addField('(9)\n', 'In-case these rules do not cover a specific situation, mods are allowed to follow their own judgement.')
            .addField('(10)\n', 'We all have our preferences, but do not force it upon one another.')
            .addField('(11)\n', 'This is a Linux based server, keep distro trashtalking and/or editor shittalk to yourself.')
            .setURL('https://discord.gg/dSCqtqj')
            .setFooter('Violating these rules may cause a kick, mute or ban from the server.')
            .setTimestamp();
        return message.channel.send({
            embed: embed
        });
    },
};