npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMemberUpdate: async function (oldMember, newMember) {
    //ignoredbl
    if (newMember.guild.id == "264445053596991498") return;
    //
    const guildChannels = getGuild.get(oldMember.guild.id);
    if (guildChannels) {
      var thisguild = newMember.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var logsChannel1 = newMember.client.channels.cache.get(guildChannels.logsChannel);
    } else {
      var logsChannel1 = "0";
    }
    if (logsChannel1 == "0") {
    } else {
      if (oldMember.nickname !== newMember.nickname) {
        if (!oldMember.nickname) {
          var oldname = "Had no nickname!";
        } else {
          var oldname = oldMember.nickname;
        }
        if (!newMember.nickname) {
          var newname = "No nickname set!";
        } else {
          var newname = newMember.nickname;
        }
        try {
          const embed = new Discord.MessageEmbed()
                      .setAuthor(
                        oldMember.user.username,
                        oldMember.user.avatarURL({ format: "jpg" })
                      )
            .setTitle(`Nickname changed!`)
            .setColor(`RANDOM`)
            .setDescription(`${oldMember.user}`)
            .addField(
              `Name changed: `,
              "\n" +
                "Old nickname: " +
                oldname +
                "\n" +
                "New nickname: " +
                newname
            )
            .setFooter(newMember.user.id)
            .setTimestamp();
          return logsChannel1.send({
            embed,
          });
        } catch {}
      }
    }
  },
};
