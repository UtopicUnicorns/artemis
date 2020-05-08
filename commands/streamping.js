const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'streamping',
    description: `[stream][mod] Turn on or off stream notification @here pings!`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('streamping');
        usage.number++;
        setUsage.run(usage);
        //
        const args = message.content.slice(prefix.length + 11).split(" ");
        if (args[0] == `on`) {
            let streamnotif = getGuild.get(message.guild.id);
            if (streamnotif.streamHere != `2`) {
                streamnotif.streamHere = `2`;
                setGuild.run(streamnotif);
                return message.reply("You turned ON @ here pings for stream notifications!");
            } else {
                return message.reply("Stream pings already have been enabled!");
            }

        }
        if (args[0] == `off`) {
            let streamnotif = getGuild.get(message.guild.id);
            if (streamnotif.streamHere != `1`) {
                streamnotif.streamHere = `1`;
                setGuild.run(streamnotif);
                return message.reply("You turned OFF @ here pings for stream notifications!");
            } else {
                return message.reply("Stream pings are already disabled!");
            }
        }
        let streamnotif = getGuild.get(message.guild.id);
        if (streamnotif.streamHere == `2`) {
            var optstatus = `Your streamchannel notifications pings are ON!`
        } else {
            var optstatus = `Your streamchannel notifications pings are OFF!`
        }
        message.reply(prefix + "streamping on/off\n" + optstatus);
    },
};