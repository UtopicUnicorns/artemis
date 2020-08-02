//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onMessageDelete: async function (message) {
    //load guild channels
    const guildChannels = getGuild.get(message.guild.id);

    //if no entry
    if (!guildChannels) return;

    //if no guild
    if (!message.client.guilds.cache.get(guildChannels.guild)) return;

    //load logger settings
    let loggerSettings = getSettings.get(message.guild.id);

    //setting failsafe
    if (!loggerSettings) {
      loggerSettings = {
        guild: message.guild.id,
        leavejoin: `0`,
        deletemsg: `0`,
        editmsg: `0`,
      };
      setSettings.run(loggerSettings);
    }

    //if off
    if (loggerSettings.deletemsg !== "1") return;

    //define logs channel
    const logsChannel1 = message.guild.channels.cache.get(
      guildChannels.logsChannel
    );

    //if no logs channel
    if (!logsChannel1) return;

    //if bot
    if (message.author.id == "440892659264126997") return;

    //if attachments
    if (message.attachments.size > 0) return;

    //fetch log
    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: "MESSAGE_DELETE",
    });

    //create log
    const deletionLog = fetchedLogs.entries.first();

    //form embed
    const embed = new Discord.MessageEmbed()
      .setTitle("A message got Deleted!!")
      .setAuthor(
        message.author.username,
        message.author.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setColor("#e74c3c")
      .addField("Deleted Message:\n", message.content + ".")
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

    //if no deletion log
    if (!deletionLog) {
      embed.setDescription(
        `Message by: ${message.author} \nDeleted by: No clue who, fuck audit logs`
      );
    } else {
      const { executor, target } = deletionLog;
      if (target && message.author) {
        if (target.id === message.author.id) {
          embed.setDescription(
            `Message by: ${message.author} \nDeleted by: ${executor}`
          );
        } else {
          return;
        }
      }
    }

    //send embed
    return logsChannel1.send({
      embed: embed,
    });
  },
};
