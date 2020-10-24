//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onMemberPrupdate: async function (oldPresence, newPresence) {
    //if no pressence
    if (!oldPresence) return;

    //define user
    const user = oldPresence.guild.members.cache.get(oldPresence.userID);

    //if no user
    if (!user) return;

    const guildChannels = getGuild.get(oldPresence.guild.id);
    if (guildChannels) {
      var thisguild = newPresence.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var logsChannel1 = newPresence.client.channels.cache.get(
        guildChannels.logsChannel
      );
    } else {
      var logsChannel1 = "0";
    }
    if (logsChannel1 == "0") {
    } else {
      if (oldPresence.user.username !== newPresence.user.username) {
        try {
          const embed = new Discord.MessageEmbed()
            .setAuthor(
              user.user.username,
              user.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
            )
            .setThumbnail(
              user.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
            )
            .setTitle(`Username changed!`)
            .setColor("#d35400")
            .setDescription(`${user.user}`)
            .addField(
              `Name changed: `,
              "\n" + user.user.username + "\n" + user.user.username
            )
            .setFooter(user.user.id)
            .setTimestamp();
          return logsChannel1.send({
            embed,
          });
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
    }
  },
};
