npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMessageDelete: async function (message) {
    //load shit
    const guildChannels = getGuild.get(message.guild.id);
    if (guildChannels) {
      var thisguild = message.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var logsChannel1 = message.guild.channels.cache.get(guildChannels.logsChannel);
      if (!logsChannel1) {
        var logsChannel1 = "0";
      }
    } else {
      var logsChannel1 = "0";
    }
    if (logsChannel1 == "0") {
    } else {
      if (message.author.id == "440892659264126997") return;
      if (message.attachments.size > 0) return;
      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: "MESSAGE_DELETE",
      });
      const deletionLog = fetchedLogs.entries.first();
      if (!deletionLog) {
        return;
      }
      const { executor, target } = deletionLog;
      if (target.id === message.author.id) {
        if (executor.id == "440892659264126997") return;
        try {
          const delmessage = new Discord.MessageEmbed()
            .setTitle("A message got Deleted!!")
            .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
            .setDescription(
              "Message by: " + message.author + "\nDeleted by: " + executor
            )
            .setColor("RANDOM")
            .addField("Deleted Message:\n", message.content)
            .addField("Channel", message.channel)
            .setFooter(
              "Message ID: " +
                message.id +
                "\nUser ID: " +
                message.author.id +
                "\nUser: " +
                message.author.tag
            )
            .setTimestamp();
          return logsChannel1.send({
            embed: delmessage,
          });
        } catch {
          console.log();
        }
      } else {
      }
    }
  },
};
