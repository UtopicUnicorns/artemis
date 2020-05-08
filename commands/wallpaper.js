const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'wallpaper',
    description: '[fun] Random wallpaper',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const photos = fs.readdirSync('./pics/wallpaper');
        const array = [];
        for (const file of photos) {
            array.push(file);
        }
        const embed = new Discord.MessageEmbed()
            .setImage('attachment://image.png')
        message.channel.send({
            embed: embed,
            files: [{
                attachment: './pics/wallpaper/' + array[~~(Math.random() * array.length)],
                name: 'image.png'
            }]
        });
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('wallpaper');
        usage.number++;
        setUsage.run(usage);
        //
    }
};