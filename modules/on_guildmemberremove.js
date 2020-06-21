//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onGuildMemberRemove: async function (guildMember) {
    //load guild channels
    const guildChannels = getGuild.get(guildMember.guild.id);

    //if no entry
    if (!guildChannels) return;

    //if no guild
    if (!guildMember.client.guilds.cache.get(guildChannels.guild)) return;

    //load logs channel
    const logsChannel1 = guildMember.client.channels.cache.get(
      guildChannels.logsChannel
    );

    //if no logs channel
    if (!logsChannel1) return;

    //load logger settings
    const loggerSettings = getSettings.get(guildMember.guild.id);

    //if off
    if (loggerSettings.leavejoin !== "1") return;

    //form embed
    const embed = new Discord.MessageEmbed()
      .setTitle(`User left`)
      .setColor('#85c1e9')
      .setAuthor(
        guildMember.user.username + "#" + guildMember.user.discriminator,
        guildMember.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        guildMember.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(`${guildMember.user}`)
      .addField(
        `This user has left us.`,
        "\n" + guildMember.user.username + "\n" + guildMember.user.id
      )
      .setTimestamp();

    //send embed
    return logsChannel1.send({
      embed,
    });
  },
};
