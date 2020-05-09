const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'leave',
    description: '[level] Leave a self assignable role',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('leave');
        usage.number++;
        setUsage.run(usage);
        //
        const args = message.content.slice(prefix.length + 6);
        const member = message.member;
        const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
        let array2 = [];
        for (const data of allroles) {
            array2.push(message.guild.roles.cache.find(r => r.id == data.roles).name);
        }
        if (array2.includes(args)) {
            const role = message.guild.roles.cache.find(r => r.name === args);
            let checking = message.member.roles.cache.find(r => r.name === args);
            if (!checking) return message.reply("You do not have this role.");
            member.roles.remove(role).catch(console.error);
            const embed = new Discord.MessageEmbed()
                .setDescription(message.author)
                .setColor('RANDOM')
                .addField('Left: ', role);
            return message.channel.send({
                embed
            });
        }
        message.reply("Invalid role!");
    }
};