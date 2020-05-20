const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "nick",
  description: "[mod] Change a user nickname",
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
    usage = getUsage.get("nick");
    usage.number++;
    setUsage.run(usage);
    //
    const user = message.mentions.users.first();
    if (!user) return message.reply("You must mention someone!");
    const args = message.content.slice(prefix.length + user.id.length + 10);
    if (!args) return message.reply("You must give a new nickname!");
    let nowtime = new Date();
    message.guild.members.cache
      .get(user.id)
      .setNickname(args)
      .catch(
        console.log('')
      );
    //LOGS
    const guildChannels = getGuild.get(message.guild.id);
    var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
    if (!logger) {
      var logger = "0";
    }
    if (logger == "0") {
    } else {
      const logsmessage = new Discord.MessageEmbed()
        .setTitle(prefix + "nick")
        .setAuthor(message.author.username, message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setDescription("Used by: " + `${message.author}`)
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
    return message.reply(user + " nickname changed to: " + args);
  },
};
