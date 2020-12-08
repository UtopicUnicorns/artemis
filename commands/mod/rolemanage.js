//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "rolemanage",
  description: "[mod] Manage self assignable roles",
  explain: `This is a semi-core command for [Reaction_Roles](#Reaction_Roles).

This command will allow you to add or remove a role from the self-asignable role list.
When a role is self-asignable, a user may use \`!join\` or \`!leave\` to obtain and remove the role for themselves.
Do note that Artemis's role needs to be higher in the role hierachy than the role you try to add/remove.
Using this command with success will add the role to the list if it was not there, and remove it from the list if it was.
You can check which roles are self-asignable with the [Numbers](#Numbers) command.

Example usage: \`!rolemanage RoleName\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `KICK_MEMBERS` permission."
      );

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
