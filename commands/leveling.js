const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'leveling',
    description: `[mscore] Turn on or off leveling for your server!`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix, leveling) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix, @leveling);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('leveling');
        usage.number++;
        setUsage.run(usage);
        //
        const args = message.content.slice(prefix.length + 9).split(" ");
        if (args[0] == `on`) {
            let levelthing = getGuild.get(message.guild.id);
            if (levelthing.leveling != `1`) {
                levelthing.leveling = `1`;
                setGuild.run(levelthing);
                return message.reply("You turned on leveling for your server!");
            } else {
                return message.reply("Leveling already enabled!");
            }

        }
        if (args[0] == `off`) {
            let levelthing = getGuild.get(message.guild.id);
            if (levelthing.leveling != `2`) {
                levelthing.leveling = `2`;
                setGuild.run(levelthing);
                return message.reply("You turned off leveling for your server!");
            } else {
                return message.reply("Leveling already disabled");
            }
        }
        let levelthing = getGuild.get(message.guild.id);
        if (levelthing.leveling == `2`) {
            var optstatus = `Leveling for your server is OFF!`
        } else {
            var optstatus = `Leveling for your server is ON!`
        }
        message.reply(prefix + "leveling on/off\n" + optstatus);
    },
};