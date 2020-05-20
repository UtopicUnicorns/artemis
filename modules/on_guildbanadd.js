npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onGuildBanAdd: async function (guild, user) {
    //load shit
    const guildChannels = getGuild.get(guild.id);
    if (guildChannels) {
      var thisguild = guild.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var logsChannel1 = guild.channels.cache.get(guildChannels.logsChannel);
      if (!logsChannel1) {
        var logsChannel1 = "0";
      }
    } else {
      var logsChannel1 = "0";
    }
    if (logsChannel1 == "0") {
    } else {
      const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_ADD",
      });
      const banLog = fetchedLogs.entries.first();
      if (!banLog) {
        const banmessage = new Discord.MessageEmbed()
          .setTitle("A user got banned!!")
          .setAuthor(user.username, user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
          .setDescription("Banned user: " + user)
          .setColor("RANDOM")
          .addField("Banned by:\n", "Probably Artemis")
          .setFooter("User ID: " + user.id + "\nUser: " + user.tag)
          .setTimestamp();
        return logsChannel1.send({
          embed: banmessage,
        });
      }
      const { executor, target } = banLog;
      if (target.id === user.id) {
        const banmessage = new Discord.MessageEmbed()
          .setTitle("A user got banned!!")
          .setAuthor(user.username, user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
          .setDescription("Banned user: " + user)
          .setColor("RANDOM")
          .addField("Banned by:\n", executor)
          .setFooter("User ID: " + user.id + "\nUser: " + user.tag)
          .setTimestamp();
        return logsChannel1.send({
          embed: banmessage,
        });
      } else {
        const banmessage = new Discord.MessageEmbed()
          .setTitle("A user got banned!!")
          .setAuthor(user.username, user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
          .setDescription("Banned user: " + user)
          .setColor("RANDOM")
          .addField("Banned by:\n", "Probably Artemis")
          .setFooter("User ID: " + user.id + "\nUser: " + user.tag)
          .setTimestamp();
        return logsChannel1.send({
          embed: banmessage,
        });
      }
    }
  },
};
