//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onGuildBanAdd: async function (guild, user) {
    //load guild channels
    const guildChannels = getGuild.get(guild.id);

    //if no guildchannels
    if (!guildChannels) return;

    //load guild
    const thisguild = guild.client.guilds.cache.get(guildChannels.guild);

    //if no guild
    if (!thisguild) return;

    //load logs channel
    const logsChannel1 = guild.channels.cache.get(guildChannels.logsChannel);

    //if no logs channel
    if (!logsChannel1) return;

    //fetch logs
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_BAN_ADD",
    });

    //define banlog
    const banLog = fetchedLogs.entries.first();

    //if no log
    const embed = new Discord.MessageEmbed()
      .setTitle("A user got banned!")
      .setAuthor(
        user.username,
        user.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setThumbnail(
        user.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setDescription("Banned user: " + `${user}`)
      .setColor('#ecf0f1')
      .addField("Banned by:\n", "Probably Artemis")
      .setFooter("User ID: " + user.id + "\nUser: " + user.tag)
      .setTimestamp();

    //if no log
    if (!banLog) {
      embed.addField("Banned by:\n", "Probably Artemis");
    } else {
      //define
      const { executor, target } = banLog;

      //if target
      if (target.id === user.id) {
        embed.addField("Banned by:\n", `${executor}`);
      } else {
        embed.addField("Banned by:\n", "Probably Artemis");
      }
    }

    //send log
    return logsChannel1.send({
      embed: embed,
    });
  },
};
