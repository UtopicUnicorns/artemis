//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "invite",
  description: "[general] bot invite and main server invite",
  explain: `This is basically self promotion for me.
This command shows my GitHub, Paypal, Website, my main Discord Server, as well as my username with discriminator.
It will also hold a link to add Artemis to your own server.

Example usage: \`!invite\``,
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
      .addField("Bot Website: ", "https://artemis.rest")
      .addField("Bot Github: ", "https://github.com/UtopicUnicorns/artemis")
      .addField(
        "Bot Invite: ",
        "https://discordapp.com/api/oauth2/authorize?client_id=440892659264126997&permissions=8&scope=bot"
      )
      .addField(
        "Support my work: ",
        "https://www.paypal.com/paypalme/utopicunicorn"
      )
      .setFooter("Bot owner: <@127708549118689280> | UtopicUnicorn#0383")
      .setTimestamp();

    //send embed
    return message.channel.send({
      embed: whoartemis,
    });
  },
};
