const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "automod",
  description: `[server] Turn on or off automod!`,
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const setGuild = db.prepare(
      "INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);"
    );
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("automod");
    usage.number++;
    setUsage.run(usage);
    //
    const args = message.content.slice(prefix.length + 8).split(" ");
    if (args[0] == `on`) {
      let automodNotif = getGuild.get(message.guild.id);
      if (automodNotif.autoMod != `2`) {
        automodNotif.autoMod = `2`;
        setGuild.run(automodNotif);
        //LOGS
        const guildChannels = getGuild.get(message.guild.id);
        var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
        if (!logger) {
          var logger = "0";
        }
        if (logger == "0") {
        } else {
          const logsmessage = new Discord.MessageEmbed()
            .setTitle(prefix + "automod")
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
        return message.reply("AutoMod is turned ON!");
      } else {
        return message.reply("AutoMod is already ON!");
      }
    }
    if (args[0] == `strict`) {
      let automodNotif = getGuild.get(message.guild.id);
      if (automodNotif.autoMod != `strict`) {
        automodNotif.autoMod = `strict`;
        setGuild.run(automodNotif);
        //LOGS
        const guildChannels = getGuild.get(message.guild.id);
        var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
        if (!logger) {
          var logger = "0";
        }
        if (logger == "0") {
        } else {
          const logsmessage = new Discord.MessageEmbed()
            .setTitle(prefix + "automod")
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
        return message.reply("AutoMod strict is turned ON!");
      } else {
        return message.reply("AutoMod strict is already ON!");
      }
    }
    if (args[0] == `off`) {
      let automodNotif = getGuild.get(message.guild.id);
      if (automodNotif.autoMod != `1`) {
        automodNotif.autoMod = `1`;
        setGuild.run(automodNotif);
        //LOGS
        const guildChannels = getGuild.get(message.guild.id);
        var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
        if (!logger) {
          var logger = "0";
        }
        if (logger == "0") {
        } else {
          const logsmessage = new Discord.MessageEmbed()
            .setTitle(prefix + "automod")
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
        return message.reply("AutoMod is turned OFF!");
      } else {
        return message.reply("AutoMod is already OFF!");
      }
    }
    let automodNotif = getGuild.get(message.guild.id);
    if (automodNotif.autoMod == `2`) {
      var optstatus = `AutoMod is ON!`;
    } else {
      var optstatus = `AutoMod is OFF!`;
    }
    message.reply(prefix + "automod on/off\n" + optstatus);
  },
};
