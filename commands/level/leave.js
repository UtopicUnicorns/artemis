//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `level`,
  name: "leave",
  description: "[level] Leave a self assignable role",
  explain: `Users can use this command when there are self-assignable roles.
This command will take away the coresponding role from the user if it exists.

Example usage: \`!leave RoleName\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("leave");
    usage.number++;
    setUsage.run(usage);

    //build args
    const args = message.content.slice(prefix.length + 6);

    //define member
    const member = message.member;

    //pull roles from db
    const allroles = db
      .prepare("SELECT * FROM roles WHERE guild = ?;")
      .all(message.guild.id);

    //empty array
    let array2 = [];

    //loop roles
    for (const data of allroles) {
      //if role exists
      if (message.guild.roles.cache.find((r) => r.id == `${data.roles}`)) {
        //push into array
        array2.push(
          message.guild.roles.cache.find((r) => r.id == data.roles).name
        );
      }
    }

    //if args match role
    if (array2.includes(args)) {
      //rebuild role
      const role = message.guild.roles.cache.find((r) => r.name === args);

      //check if user has role
      let checking = message.member.roles.cache.find((r) => r.name === args);

      //if user does not have role
      if (!checking) return message.reply("You do not have this role.");

      //clean
      message.delete();

      //remove role
      member.roles.remove(role).catch(console.error);

      //build embed
      const embed = new Discord.MessageEmbed()
        .setDescription(message.author)
        .setColor("RANDOM")
        .addField("Left: ", `${role}`);

      //send embed
      return message.channel
        .send({
          embed,
        })
        .then((message) => {
          message.delete({
            timeout: 5000,
            reason: "It had to be done.",
          });
        });
    }

    //error
    message.reply("Invalid role!").then((message) => {
      message.delete({
        timeout: 5000,
        reason: "It had to be done.",
      });
    });
  },
};
