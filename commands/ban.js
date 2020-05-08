const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "ban",
  description: "[mod] Ban a user",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.hasPermission("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("ban");
    usage.number++;
    setUsage.run(usage);
    //
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("You need to mention the user you wish to ban!");
    }
    //LOGS
    const guildChannels = getGuild.get(message.guild.id);
    var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
    if (!logger) {
      var logger = "0";
    }
    if (logger == "0") {
    } else {
      const logsmessage = new Discord.MessageEmbed()
        .setTitle(prefix + "ban")
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription("Used by: " + message.author)
        .setURL(message.url)
        .setColor("RANDOM")
        .addField("Usage:\n", message.content, true)
        .addField("Channel", message.channel, true)
        .setFooter("Message ID: " + message.id)
        .setTimestamp();
      logger
        .send({
          embed: logsmessage,
        })
        .catch((error) =>
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          )
        );
    }
    //
    return member
      .members.ban()
      .then(() => message.reply(`${member.user.tag} was banned.`))
      .catch((error) => message.reply("Sorry, an error occured."));
  },
};
