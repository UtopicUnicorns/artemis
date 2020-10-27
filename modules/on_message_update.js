//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onMsgUpdate: async function (oldMessage, newMessage) {
    //if bot
    if (newMessage.author.bot) return;
    //if same message
    if (oldMessage.content == newMessage.content) return;
    //if emoji
    if (newMessage.content.toLowerCase().includes("emoji steal")) return;

    //if no newguild
    if (!newMessage) return;

    //load prefix
    const prefixstart = getGuild.get(newMessage.guild.id);
    const prefix = prefixstart.prefix;

    //load guild channels
    const guildChannels = getGuild.get(newMessage.guild.id);

    //if no entry
    if (!guildChannels) return;

    //if no guild
    if (!newMessage.client.guilds.cache.get(guildChannels.guild)) return;

    //load logs channel
    const logsChannel1 = newMessage.client.channels.cache.get(
      guildChannels.logsChannel
    );

    //if no logs channel
    if (logsChannel1) {
      //load logger settings
      let loggerSettings = getSettings.get(newMessage.guild.id);

      //setting failsafe
      if (!loggerSettings) {
        loggerSettings = {
          guild: newMessage.guild.id,
          leavejoin: `0`,
          deletemsg: `0`,
          editmsg: `0`,
        };
        setSettings.run(loggerSettings);
      }

      //if on
      if (loggerSettings.editmsg == "1") {
        //form user
        let user = newMessage.guild.members.cache.get(newMessage.author.id);

        //length
        if (oldMessage.content.length + newMessage.content.length < 2000) {
          //form embed
          const embed = new Discord.MessageEmbed()
            .setTitle(`Message edited`)
            .setColor("#d4ac0d")
            .setAuthor(
              user.user.username + "#" + user.user.discriminator,
              user.user.displayAvatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setThumbnail(
              user.user.displayAvatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setDescription(`${user} edited a message`)
            .addField("Old: ", oldMessage.content, true)
            .addField("New: ", newMessage.content, true)
            .setTimestamp();

          //send embed
          logsChannel1.send({
            embed,
          });
        }
      }
    }

    //define command name
    const commandName = newMessage.content
      .slice(prefix.length)
      .toLowerCase()
      .split(/ +/);

    //define command
    const command = newMessage.client.commands.get(commandName.shift());

    //if command does not start with prefix
    if (!newMessage.content.startsWith(prefix)) return;

    //check if channel exists
    let controller = getCC.get(newMessage.channel.id);

    //disable commands if exists
    if (controller) {
      if (!newMessage.member.permissions.has("KICK_MEMBERS")) return;
    }

    //do your shit
    try {
      command.execute(newMessage);
    } catch (error) {
      //
    }
  },
};
