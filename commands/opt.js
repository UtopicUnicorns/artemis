const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'opt',
    description: `[general] opt in out out from translation`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('opt');
        usage.number++;
        setUsage.run(usage);
        //
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
        const args = message.content.slice(prefix.length + 4).split(" ");
        if (args[0] == `in`) {
            let translate = getScore.get(message.author.id, message.guild.id);
            if (translate.translate != `2`) {
                translate.translate = `2`;
                setScore.run(translate);
                return message.reply("You have opted in to auto translation!\nNote that your message will go trough a few non-opensource/private translators.");
            } else {
                return message.reply("You are already opted in!");
            }

        }
        if (args[0] == `out`) {
            let translate = getScore.get(message.author.id, message.guild.id);
            if (translate.translate == `2`) {
                translate.translate = `1`;
                setScore.run(translate);
                return message.reply("You opted out of auto translation!");
            } else {
                return message.reply("You are already opted out!");
            }
        }
        let translate = getScore.get(message.author.id, message.guild.id);
        if (translate.translate == `2`) {
            var optstatus = `Auto Translation is ON!`
        } else {
            var optstatus = `Auto Translation is OFF!`
        }
        message.reply(prefix + "opt in/out\n" + optstatus);
    },
};