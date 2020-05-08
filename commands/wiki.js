const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'wiki',
    description: '[fun] Wikipedia stuff',
    async execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        let args = message.content.slice(prefix.length + 5);
        let doc = await wtf.fetch(args);
        try {
            let json = doc.json()
            const embed = new Discord.MessageEmbed()
                .addField(args + '\n', json.sections[0].paragraphs[0].sentences[0].text)
            message.channel.send({
                embed: embed
            });
        } catch {
            return message.reply("Could not find output!");
        }
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('wiki');
        usage.number++;
        setUsage.run(usage);
        //
    }
};