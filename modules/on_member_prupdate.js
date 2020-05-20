npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMemberPrupdate: async function (oldPresence, newPresence) {
    if (!oldPresence) return;
    const user = oldPresence.guild.members.cache.get(oldPresence.userID);
    if (!user) return;
    //Twitch notifications
    if (oldPresence.activities !== newPresence.activities) {
      if (!oldPresence.activities[0]) {
        return;
      }
      var hello = newPresence.activities;
      for (var i = 0; i < hello.length; i++) {
        if (hello[i].name == "Twitch") {
          //load shit
          const guildChannels = getGuild.get(newPresence.guild.id);
          if (guildChannels) {
            var thisguild = newPresence.client.guilds.cache.get(
              guildChannels.guild
            );
          }
          if (thisguild) {
            var streamChannel1 = newPresence.client.channels.cache.get(
              guildChannels.streamChannel
            );
            var streamNotif = guildChannels.streamHere;
          } else {
            var streamChannel1 = "0";
            var streamNotif = "0";
          }
          if (guildChannels.streamChannel == "0") {
            return;
          } else {
            //check if user wants notifications
            let streamcheck = getScore.get(user.id, newPresence.guild.id);
            if (!streamcheck) return;
            if (streamcheck.stream == `2`) {
            } else {
              let getTimers2 = db.prepare(
                "SELECT * FROM timers WHERE uid = ? AND gid = ? AND bs = 'stream'"
              );
              let timersCheck = getTimers2.get(user.id, newPresence.guild.id);
              if (timersCheck) {
              } else {
                let datefor = moment()
                  .add("7200000", "ms")
                  .format("YYYYMMDDHHmmss");
                timerset = {
                  mid: Math.random() * 999999,
                  cid: user.user.id,
                  gid: newPresence.guild.id,
                  uid: user.user.id,
                  time: datefor,
                  bs: `stream`,
                };
                setTimers.run(timerset);
                let TSTA = hello[i].state;
                let TURL = hello[i].url;
                let TDET = hello[i].details;
                let TSID = streamChannel1.id;
                request(
                  "https://api.rawg.io/api/games?page_size=5&search=" + TSTA,
                  {
                    json: true,
                  },
                  function (err, res, body) {
                    //start embed
                    if (streamNotif == "2") {
                      streamChannel1.send("@here");
                    }
                    const embed = new Discord.MessageEmbed()
                      .setAuthor(
                        user.user.username,
                        user.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                      )
                      .setTitle(TSTA)
                      .setColor(`RANDOM`)
                      .setURL(TURL)
                      .setDescription(
                        `${user.user}/${user.user.username} went live!`
                      )
                      .addField(TDET, "\n" + TURL)
                      .setTimestamp();
                    if (body.results[0].background_image) {
                      embed.setThumbnail(`${body.results[0].background_image}`);
                    }
                    return newPresence.client.channels.cache.get(TSID).send({
                      embed,
                    });
                  }
                );
              }
            }
          }
        }
      }
    }
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
              user.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
            )
            .setTitle(`Username changed!`)
            .setColor(`RANDOM`)
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
