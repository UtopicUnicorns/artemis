const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'dog',
    description: '[fun] Random dog picture',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        let baseurl = "https://some-random-api.ml/img/dog";
        let url = baseurl;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.MessageEmbed()
                .setImage(body.link)
            message.channel.send({
                embed: embed
            });
        });
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('dog');
        usage.number++;
        setUsage.run(usage);
        //
    }
};