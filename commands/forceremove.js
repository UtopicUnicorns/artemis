const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "forceremove",
  description: "[mod] remove a database entry",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("forceremove");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 12);
    if (!args) return message.reply(prefix + "forceremove userID");
    try {
      db.prepare(
        `DELETE FROM scores WHERE user = ${args} AND guild = ${message.guild.id}`
      ).run();
      message.reply("Deleted database entry for: " + args);
    } catch {
      return message.reply("Something went wrong.");
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
        .setTitle(prefix + "forceremove")
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
  },
};
