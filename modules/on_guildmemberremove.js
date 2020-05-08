npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onGuildMemberRemove: async function (guildMember) {
    //ignoredbl
    if (guildMember.guild.id == "264445053596991498") return;
    //load shit
    const guildChannels = getGuild.get(guildMember.guild.id);
    if (guildChannels) {
      var thisguild = guildMember.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var logsChannel1 = guildMember.client.channels.cache.get(guildChannels.logsChannel);
    } else {
      var logsChannel1 = "0";
    }
    if (logsChannel1 == "0") {
    } else {
      try {
        const embed = new Discord.MessageEmbed()
          .setTitle(`User Left The Building`)
          .setColor(`RANDOM`)
          .setDescription(guildMember.user)
          .addField(
            `This user has left us.`,
            "\n" + guildMember.user.username + "\n" + guildMember.user.id
          )
          .setTimestamp();
        return logsChannel1.send({
          embed,
        });
      } catch {}
    }
  },
};
