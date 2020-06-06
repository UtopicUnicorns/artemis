//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "check",
  description: "[server] Role check",
  explain: `This command allows you to see which user have what role and which do not.\n
  \`check not RoleName/RoleID\`\n\`check yes RoleName/RoleID\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if member has perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("check");
    usage.number++;
    setUsage.run(usage);

    //form first args
    const args = message.content.slice(prefix.length + 6).split(" ");

    //form second args
    const cargs = message.content.slice(prefix.length + 10);

    //if no args
    if (!args)
      return message.reply("Provide 2 more args not/yes + roleID/roleName");

    //throw all members into an array
    let array = await message.guild.members.cache.map((m) => m);

    //if args is not
    if (args[0] == "not") {
      //to be filled
      let str = "";

      //loop array
      for (let i of array) {
        //if cannot find the role
        if (
          !i.roles.cache.find((r) => r.name === cargs) ||
          i.roles.cache.find((r) => r.id === cargs)
        ) {
          //push into array
          str += `${i}\n`;
        }
      }

      //define role
      let role =
        message.guild.roles.cache.find((r) => r.id === cargs) ||
        message.guild.roles.cache.find((r) => r.name === cargs);

      //build embed
      const check = new Discord.MessageEmbed()
        .setTitle("RoleCheck")
        .setColor("RANDOM")
        .addField("These users do not have: ", `${role} \n\n ${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: check,
      });
    }

    //if args is yes
    if (args[0] == "yes") {
      //empty stuff
      let str = "";

      //loop array
      for (let i of array) {
        //if can find role
        if (
          i.roles.cache.find((r) => r.name === cargs) ||
          i.roles.cache.find((r) => r.id === cargs)
        ) {
          //push into emty stuff
          str += `${i}\n`;
        }
      }

      //define role
      let role =
        message.guild.roles.cache.find((r) => r.id === cargs) ||
        message.guild.roles.cache.find((r) => r.name === cargs);

      //build embed
      const check = new Discord.MessageEmbed()
        .setTitle("RoleCheck")
        .setColor("RANDOM")
        .addField("These users have: ", `${role} \n\n ${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: check,
      });
    }
  },
};
