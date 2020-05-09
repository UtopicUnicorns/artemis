const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "purge",
  description: "[mod] Purge a mentioned user or a specified ammount",
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
    usage = getUsage.get("purge");
    usage.number++;
    setUsage.run(usage);
    //
    const user = message.mentions.users.first();
    const amount = !!parseInt(message.content.split(" ")[1])
      ? parseInt(message.content.split(" ")[1])
      : parseInt(message.content.split(" ")[2]);
    if (!amount) return message.reply("Must specify an amount to delete!");
    if (!amount && !user)
      return message.reply(
        "Must specify a user and amount, or just an amount, of messages to purge!"
      );
    message.channel
      .messages.fetch({
        limit: 100,
      })
      .then((messages) => {
        if (user) {
          const filterBy = user ? user.id : Client.user.id;
          messages = messages
            .filter((m) => m.author.id === filterBy)
            .array()
            .slice(0, amount);
        } else {
          messages = messages.array().slice(0, amount);
        }
        message.channel
          .bulkDelete(messages)
          .catch((error) => console.log(error.stack));
        //LOGS
        const guildChannels = getGuild.get(message.guild.id);
        var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
        if (!logger) {
          var logger = "0";
        }
        if (logger == "0") {
        } else {
          const logsmessage = new Discord.MessageEmbed()
            .setTitle(prefix + "purge")
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
      });
  },
};
