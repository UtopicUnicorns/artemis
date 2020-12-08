//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "vote",
  description: "[mod] Make a simple yes/no vote",
  explain: `This creates a simple and small vote where users can vote yes or no.

Example usage: \`!vote yes/no question\``,
  async execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //update usage
    usage = getUsage.get("vote");
    usage.number++;
    setUsage.run(usage);

    //voteQuestion
    let voteQuestion = message.content.slice(prefix.length + 5);

    //delete vote message
    message.delete();

    //create embed
    const embed = new Discord.MessageEmbed()
      .setAuthor(
        message.author.username,
        message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setTitle("Vote")
      .setColor(`RANDOM`)
      .setDescription(`${voteQuestion}`);

    //send embed and react
    message.channel.send(embed).then((message) => {
      message.react("✅").then(() => message.react("❌"));
    });
  },
};
