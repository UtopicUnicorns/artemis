const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'rolemanage',
    description: '[mscore] Manage self assignable roles',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const getRoles = db.prepare("SELECT * FROM roles WHERE roles = ?");
        const setRoles = db.prepare("INSERT OR REPLACE INTO roles (guild, roles) VALUES (@guild, @roles);");
        if (!message.member.permissions.has('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('rolemanage');
        usage.number++;
        setUsage.run(usage);
        //
        if (message.content === `${prefix}rolemanage`) {
            const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
            let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
            let array2 = [];
            let str = "";
            for (const data of allroles) {
                array2.push(data.roles);
            }
            for (let i of array) {
                if (array2.includes(i.id))
                    str += message.guild.roles.cache.find(r => r.name === (i.name)) + "\n";
            }
            const embed = new Discord.MessageEmbed()
                .setTitle("Manage self assignable roles")
                .setColor('RANDOM')
                .addField('Command usage: ', prefix + 'rolemanage roleNAME/roleID')
                .addField('Current self assignable roles: ', `${str}`);
            return message.channel.send({
                embed
            });
        }
        const args = message.content.slice(prefix.length + 11).split(" ");
        const rolechecker = message.guild.roles.cache.find(r => r.name === (`${args}`)) || message.guild.roles.cache.find(r => r.id === (`${args}`));
        if (!rolechecker) {
            return console.log(args + ' is not a role.');
        }
        let rolecheck = getRoles.get(rolechecker.id);
        if (!rolecheck) {
            rolecheck = {
                guild: message.guild.id,
                roles: rolechecker.id
            }
            message.channel.send('+Added role to self assignable list ' + message.guild.id + ' ' + rolechecker);
        } else {
            db.prepare(`DELETE FROM roles WHERE roles = ${rolechecker.id}`).run();
            return message.channel.send('-Removed role from self assignable list ' + message.guild.id + ' ' + rolechecker);
        }
        setRoles.run(rolecheck);

    }
};