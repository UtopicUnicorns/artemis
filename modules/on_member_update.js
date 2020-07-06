//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onMemberUpdate: async function (oldMember, newMember) {
    //load guild channels
    const guildChannels = getGuild.get(oldMember.guild.id);

    //if no entry
    if (!guildChannels) return;

    //if no guild
    if (!newMember.client.guilds.cache.get(guildChannels.guild)) return;

    //define logs channel
    var logsChannel1 = newMember.client.channels.cache.get(
      guildChannels.logsChannel
    );

    //if no logs
    if (!logsChannel1) return;

    //if old is not new
    if (oldMember.nickname !== newMember.nickname) {
      //define nicknames
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

      //form embed
      const embed = new Discord.MessageEmbed()
        .setAuthor(
          oldMember.user.username,
          oldMember.user.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setThumbnail(
          oldMember.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setTitle(`Nickname changed!`)
        .setColor("#0e6251")
        .setDescription(`${oldMember.user}`)
        .addField(
          `Name changed: `,
          "\n" + "Old nickname: " + oldname + "\n" + "New nickname: " + newname
        )
        .setFooter(newMember.user.id)
        .setTimestamp();

      //send embed
      return logsChannel1.send({
        embed,
      });
    }
  },
};
