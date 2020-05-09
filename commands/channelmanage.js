const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'channelmanage',
    description: '[server] Manage preset channels',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);");
        if (!message.member.permissions.has('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('channelmanage');
        usage.number++;
        setUsage.run(usage);
        //
        if (message.content === `${prefix}channelmanage`) {
            let channelget = getGuild.get(message.guild.id);
            const hellothereguilde = new Discord.MessageEmbed()
                .setTitle('Manage Channels')
                .setColor('RANDOM')
                .addField('Command usage:\n', `${prefix}channelmanage mute/general/highlight/logs/stream chanID/chanNAME`)
                .addField('General Channel: ', message.guild.channels.cache.find(channel => channel.id === channelget.generalChannel))
                .addField('Mute Channel: ', message.guild.channels.cache.find(channel => channel.id === channelget.muteChannel))
                .addField('Logs Channel: ', message.guild.channels.cache.find(channel => channel.id === channelget.logsChannel))
                .addField('Highlight Channel: ', message.guild.channels.cache.find(channel => channel.id === channelget.highlightChannel))
                .addField('Reaction Roles Channel: ', message.guild.channels.cache.find(channel => channel.id === channelget.reactionChannel))
                .addField('Stream Notification Channel: ', message.guild.channels.cache.find(channel => channel.id === channelget.streamChannel))
                .setTimestamp();
            return message.channel.send({
                embed: hellothereguilde
            });
        }
        const args = message.content.slice(prefix.length + 14).split(" ");
        if (args[0] == 'mute') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            if (args[1] == 'null' || args[1] == 'reset' || args[1] == '0') {
                channelget.muteChannel = `0`;
                message.reply(args[0] + ' channel has been set to 0/reset!');
                return setGuild.run(channelget);
            }
            let channelcheck = message.guild.channels.cache.find(channel => channel.id === args[1]) || message.guild.channels.cache.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!\nIf you used Channelname try using channelID instead!");
            channelget.muteChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Mute channel has been changed to " + channelcheck);
        }
        if (args[0] == 'general') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            if (args[1] == 'null' || args[1] == 'reset' || args[1] == '0') {
                channelget.generalChannel = `0`;
                message.reply(args[0] + ' channel has been set to 0/reset!');
                return setGuild.run(channelget);
            }
            let channelcheck = message.guild.channels.cache.find(channel => channel.id === args[1]) || message.guild.channels.cache.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!\nIf you used Channelname try using channelID instead!");
            channelget.generalChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("General channel has been changed to " + channelcheck);
        }
        if (args[0] == 'highlight') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            if (args[1] == 'null' || args[1] == 'reset' || args[1] == '0') {
                channelget.highlightChannel = `0`;
                message.reply(args[0] + ' channel has been set to 0/reset!');
                return setGuild.run(channelget);
            }
            let channelcheck = message.guild.channels.cache.find(channel => channel.id === args[1]) || message.guild.channels.cache.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!\nIf you used Channelname try using channelID instead!");
            channelget.highlightChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Highlight channel has been changed to " + channelcheck);
        }
        if (args[0] == 'logs') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            if (args[1] == 'null' || args[1] == 'reset' || args[1] == '0') {
                channelget.logsChannel = `0`;
                message.reply(args[0] + ' channel has been set to 0/reset!');
                return setGuild.run(channelget);
            }
            let channelcheck = message.guild.channels.cache.find(channel => channel.id === args[1]) || message.guild.channels.cache.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!\nIf you used Channelname try using channelID instead!");
            channelget.logsChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Logs channel has been changed to " + channelcheck);
        }
        if (args[0] == 'stream') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            if (args[1] == 'null' || args[1] == 'reset' || args[1] == '0') {
                channelget.streamChannel = `0`;
                message.reply(args[0] + ' channel has been set to 0/reset!');
                return setGuild.run(channelget);
            }
            let channelcheck = message.guild.channels.cache.find(channel => channel.id === args[1]) || message.guild.channels.cache.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!\nIf you used Channelname try using channelID instead!");
            channelget.reactionChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Stream channel has been changed to " + channelcheck);
        }
        if (args[0] == 'reaction') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            if (args[1] == 'null' || args[1] == 'reset' || args[1] == '0') {
                channelget.reactionChannel = `0`;
                message.reply(args[0] + ' channel has been set to 0/reset!');
                return setGuild.run(channelget);
            }
            let channelcheck = message.guild.channels.cache.find(channel => channel.id === args[1]) || message.guild.channels.cache.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!\nIf you used Channelname try using channelID instead!");
            channelget.reactionChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Reaction Roles channel has been changed to " + channelcheck);
        }
    }
};