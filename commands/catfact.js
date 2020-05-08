const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'catfact',
    description: '[fun] Random cat fact',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        let baseurl = "https://some-random-api.ml/facts/cat";
        let url = baseurl;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            message.channel.send(body.fact);
        });
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('catfact');
        usage.number++;
        setUsage.run(usage);
        //
    }
};