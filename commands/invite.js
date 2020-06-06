//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "invite",
  description: "[general] bot invite and main server invite",
  explain: `This command displays the github of the bot, main server invite, bot invite, patreon link and creator tag.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("invite");
    usage.number++;
    setUsage.run(usage);

    //build embed
    const whoartemis = new Discord.MessageEmbed()
      .setTitle("Invite")
      .setAuthor(
        message.author.username,
        message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setColor("RANDOM")
      .setDescription("Hello, I am Artemis!")
      .addField("Main discord server: ", "https://discord.gg/EVVtPpw")
      .addField("Bot Website: ", "https://artemisbot.eu")
      .addField("Bot Github: ", "https://github.com/UtopicUnicorns/artemis")
      .addField(
        "Bot Invite: ",
        "https://discordapp.com/api/oauth2/authorize?client_id=440892659264126997&permissions=8&scope=bot"
      )
      .addField("Support my work: ", "https://www.patreon.com/utopicunicorn")
      .setFooter("Bot owner: <@127708549118689280> | UtopicUnicorn#0383")
      .setTimestamp();

    //send embed
    return message.channel.send({
      embed: whoartemis,
    });
  },
};
