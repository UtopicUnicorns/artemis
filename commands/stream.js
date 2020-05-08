const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'stream',
    description: `[stream] turn on or off your own stream notifications`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('stream');
        usage.number++;
        setUsage.run(usage);
        //
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
        const args = message.content.slice(prefix.length + 7).split(" ");
        if (args[0] == `on`) {
            let stream = getScore.get(message.author.id, message.guild.id);
            if (stream.stream != `1`) {
                stream.stream = `1`;
                setScore.run(stream);
                return message.reply("You turned on your own stream notifications!");
            } else {
                return message.reply("You already turned on your stream notifications!");
            }

        }
        if (args[0] == `off`) {
            let stream = getScore.get(message.author.id, message.guild.id);
            if (stream.stream != `2`) {
                stream.stream = `2`;
                setScore.run(stream);
                return message.reply("You turned off your own stream notifications!");
            } else {
                return message.reply("You already turned off your stream notifications!");
            }
        }
        let stream = getScore.get(message.author.id, message.guild.id);
        if (stream.stream == `2`) {
            var optstatus = `Your stream notifications are OFF!`
        } else {
            var optstatus = `Your stream notifications are ON!`
        }
        message.reply(prefix + "stream on/off\n" + optstatus);
    },
};