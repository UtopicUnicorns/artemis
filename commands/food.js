const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'food',
    description: '[fun] Random food picture',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const photos = fs.readdirSync('./pics/food');
        const array = [];
        for (const file of photos) {
            array.push(file);
        }
        const embed = new Discord.MessageEmbed()
            .setImage('attachment://image.png')
        message.channel.send({
            embed: embed,
            files: [{
                attachment: './pics/food/' + array[~~(Math.random() * array.length)],
                name: 'image.png'
            }]
        });
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('food');
        usage.number++;
        setUsage.run(usage);
        //
    }
};