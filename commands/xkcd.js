const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'xkcd',
    description: '[fun] Xkcd images',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('xkcd');
        usage.number++;
        setUsage.run(usage);
        //
        if (message.content == `${prefix}xkcd random`) {
            let baseurl = `https://xkcd.com/`;
            let num = Math.floor(Math.random() * 2200) + 1;
            let end = `/info.0.json`;
            let url = baseurl + num + end;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.MessageEmbed()
                    .setTitle(body.safe_title)
                    .setURL(`https://xkcd.com/${body.num}/`)
                    .setColor('#RANDOM')
                    .setImage(body.img)
                    .setFooter(body.alt)
                 message.channel.send({
                    embed: embed
                });
            });
            return
        }
        let args = message.content.slice().split(` `);
        if (!args[1]) {
            let url = `https://xkcd.com/info.0.json`;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.MessageEmbed()
                    .setTitle(body.safe_title)
                    .setURL(`https://xkcd.com/${body.num}/`)
                    .setColor('#RANDOM')
                    .setImage(body.img)
                    .setFooter(body.alt)
                 message.channel.send({
                    embed: embed
                });
            });
            return
        }
        let baseurl = `https://xkcd.com/`;
        let num = args[1];
        let end = `/info.0.json`;
        let url = baseurl + num + end;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.MessageEmbed()
                .setTitle(body.safe_title)
                .setURL(`https://xkcd.com/${body.num}/`)
                .setColor('#RANDOM')
                .setImage(body.img)
                .setFooter(body.alt)
            return message.channel.send({
                embed: embed
            });
        });
    }
};