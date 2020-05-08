const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'ask',
    description: '[linux] Ask Ubuntu api',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        let baseurl = "https://api.stackexchange.com/2.2/search/advanced?pagesize=1&order=desc&sort=votes&q=";
        let q = message.content.slice(prefix.length + 4);
        let key = '&site=askubuntu&key=' + configfile.askkey;
        let url = baseurl + q + key;
        request(url, {
            gzip: true,
            json: true
        }, (error, response, body) => {
            if (body.items < 1) return message.reply("Page not found!");
            const embed = new Discord.MessageEmbed()
                .setTitle(body.items[0].title)
                .setAuthor(body.items[0].owner.display_name, body.items[0].owner.profile_image)
                .attachFiles(['./modules/img/ask.png'])
                .setThumbnail('attachment://ask.png')
                .setURL(body.items[0].link)
                .setColor('RANDOM')
                .setDescription(`Created at: ${moment.utc(body.items[0].creation_date).format('dddd, MMMM Do YYYY, HH:mm:ss')}`)
                .addField(body.items[0].title + '\n', body.items[0].closed_reason)
                .addField('Link: ', body.items[0].link)
                .addField('Answers: ', body.items[0].answer_count)
                .addField('Views: ', body.items[0].view_count)
                .addField('Score: ', body.items[0].score)
                .setFooter('tags: ' + body.items[0].tags)
            message.channel.send({
                embed: embed
            });
        });
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('ask');
        usage.number++;
        setUsage.run(usage);
        //

    }
};