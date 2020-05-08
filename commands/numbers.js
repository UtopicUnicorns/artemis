const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
    name: 'numbers',
    description: '[level] Display role sizes',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('numbers');
        usage.number++;
        setUsage.run(usage);
        //
        const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
        let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
        let array2 = [];
        let str = "";
        for (const data of allroles) {
            array2.push(data.roles);
        }
        for (let i of array) {
           if(array2.includes(i.id))
            str += message.guild.roles.cache.find(r => r.name === (i.name)) + ": " + message.guild.roles.cache.find(r => r.name === (i.name)).members.size + "\n";
        }
        const embed = new Discord.MessageEmbed()
            .setTitle("Role Sizes")
            .setColor('RANDOM')
            .addField('Roles', `${str}`);
        message.channel.send({
            embed
        });
    }
};