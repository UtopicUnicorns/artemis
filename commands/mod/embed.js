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
  explain: `Embeds are used to make some text look prettier.
The first line contains the embed title, the rows/lines after that will be the content of the embed.
Do note that this command needs you to use newLines (Shift + enter).


Example usage: 

\`\`\` sh
!embed [Title]

[Content]

[Content]

[Content]
\`\`\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

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
