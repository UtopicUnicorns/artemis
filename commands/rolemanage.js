//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "rolemanage",
  description: "[mscore] Manage self assignable roles",
  explain: `This command will allow you to make roles self assignable/ready for reaction roles.\n
  By using \`rolemanage roleName\roleID\` you add or remove the self asignable role.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("rolemanage");
    usage.number++;
    setUsage.run(usage);

    //if just rolemanage
    if (message.content === `${prefix}rolemanage`) {
      //pull all roles from db
      const allroles = db
        .prepare("SELECT * FROM roles WHERE guild = ?;")
        .all(message.guild.id);

      //array is guild roles
      let array = message.guild.roles.cache
        .sort((a, b) => a.position - b.position)
        .map((role) => role);

      //empty array
      let array2 = [];

      //empty string
      let str = "";

      //loop trough db roles
      for (const data of allroles) {
        //push into array2
        array2.push(data.roles);
      }

      //loop trough guild array
      for (let i of array) {
        //if database matches guild roles
        if (array2.includes(i.id))
          str += `${message.guild.roles.cache.find(
            (r) => r.name === i.name
          )} \n`;
      }

      //form embed
      const embed = new Discord.MessageEmbed()
        .setTitle("Manage self assignable roles")
        .setColor("RANDOM")
        .addField("Command usage: ", prefix + "rolemanage roleNAME/roleID")
        .addField("Current self assignable roles: ", `${str}\n-`);

      //send embed
      return message.channel.send({
        embed,
      });
    }

    //define args
    const args = message.content.slice(prefix.length + 11).split(" ");

    //check if role exists
    const rolechecker =
      message.guild.roles.cache.find((r) => r.name === `${args}`) ||
      message.guild.roles.cache.find((r) => r.id === `${args}`);

    //does not exist
    if (!rolechecker) {
      return message.reply(`${args} is not a role!`);
    }

    //init db
    const getRoles2 = db.prepare("SELECT * FROM roles WHERE roles = ?");

    //pull data from database
    let rolecheck = getRoles2.get(rolechecker.id);

    //if role is not in database add it
    if (!rolecheck) {
      rolecheck = {
        guild: message.guild.id,
        roles: rolechecker.id,
      };

      //notify
      message.channel.send(
        `+Added role to self assignable list\n Guild: ${message.guild}\n Role: ${rolechecker.name}`
      );
    } else {
      //delete from database
      db.prepare(`DELETE FROM roles WHERE roles = ${rolechecker.id}`).run();

      //notify
      return message.channel.send(
        `-Removed role from self assignable list\n Guild: ${message.guild}\n Role: ${rolechecker.name}`
      );
    }

    //run database
    setRoles.run(rolecheck);
  },
};
