//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "embed",
  description: "[mod] generate an embed",
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user has perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

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
