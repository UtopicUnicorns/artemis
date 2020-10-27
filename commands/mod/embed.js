//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "embed",
  description: "[mod] generate an embed",
  explain: `Form a fancy embed in the channel you use this command in.\n
  The first line after the command will create the title for the embed, every new line after will be content.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user has perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You do not have permissions to use this command!");

    //update usage
    usage = getUsage.get("embed");
    usage.number++;
    setUsage.run(usage);

    //build args
    let args = message.content.slice(prefix.length + 6).split("\n");

    //delete message
    message.delete();

    //define user
    let user = message.guild.members.cache.get(message.author.id);

    //build embed
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        user.user.username,
        user.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setColor(`RANDOM`)
      .setTitle(args[0])
      .setDescription(args);

    //send embed
    return message.channel.send({
      embed,
    });
  },
};
