npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMemberPrupdate: async function (oldMember, newMember) {
    //ignoredbl
    if (newMember.guild.id == "264445053596991498") return;
    //Twitch notifications
    if (oldMember.presence.game !== newMember.presence.game) {
      if (!newMember.presence.game) {
        return;
      }
      if (!newMember.presence.game.url) {
        return;
      }
      if (newMember.presence.game.url.includes("twitch")) {
        //load shit
        const guildChannels = getGuild.get(newMember.guild.id);
        if (guildChannels) {
          var thisguild = newMember.client.guilds.cache.get(guildChannels.guild);
        }
        if (thisguild) {
          var streamChannel1 = newMember.client.channels.cache.get(
            guildChannels.streamChannel
          );
          var streamNotif = guildChannels.streamHere;
        } else {
          var streamChannel1 = "0";
          var streamNotif = "0";
        }
        if (streamChannel1 == "0") {
        } else {
          if (!streamChannel1) return;
          //check if user wants notifications
          let user = newMember.user;
          let streamcheck = getScore.get(user.id, newMember.guild.id);
          if (!streamcheck) {
            streamcheck = {
              id: `${newMember.guild.id}-${newMember.user.id}`,
              user: newMember.user.id,
              guild: newMember.guild.id,
              points: 0,
              level: 1,
              warning: 0,
              muted: 0,
              translate: 0,
              stream: 0,
              notes: 0,
            };
          }
          setScore.run(streamcheck);
          if (streamcheck.stream == `2`) {
          } else {
            let getTimers2 = db.prepare(
              "SELECT * FROM timers WHERE uid = ? AND gid = ? AND bs = 'stream'"
            );
            let timersCheck = getTimers2.get(user.id, newMember.guild.id);
              if (timersCheck) {
              } else {
                let datefor = moment()
                  .add("7200000", "ms")
                  .format("YYYYMMDDHHmmss");
                timerset = {
                  mid: Math.random() * 999999,
                  cid: newMember.user.id,
                  gid: newMember.guild.id,
                  uid: newMember.user.id,
                  time: datefor,
                  bs: `stream`,
                };
                setTimers.run(timerset);
                request(
                  "https://api.rawg.io/api/games?page_size=5&search=" +
                    newMember.presence.game.state,
                  {
                    json: true,
                  },
                  function (err, res, body) {
                    if (!body.results[0].background_image) {
                      try {
                        if (streamNotif == "2") {
                          streamChannel1.send("@here");
                        }
                        const embed = new Discord.MessageEmbed()
                          .setTitle(newMember.presence.game.state)
                          .setColor(`RANDOM`)
                          .setURL(newMember.presence.game.url)
                          .setDescription(newMember.user + " went live!")
                          .addField(
                            newMember.presence.game.details,
                            "\n" + newMember.presence.game.url
                          )
                          .setTimestamp();
                        return streamChannel1.send({
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
                    try {
                      if (streamNotif == "2") {
                        streamChannel1.send("@here");
                      }
                      const embed = new Discord.MessageEmbed()
                        .setTitle(newMember.presence.game.state)
                        .setColor(`RANDOM`)
                        .setURL(newMember.presence.game.url)
                        .setThumbnail(`${body.results[0].background_image}`)
                        .setDescription(newMember.user + " went live!")
                        .addField(
                          newMember.presence.game.details,
                          "\n" + newMember.presence.game.url
                        )
                        .setTimestamp();
                      return streamChannel1.send({
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
                );
              }
          }
        }
      }
    }
    const guildChannels = getGuild.get(oldMember.guild.id);
    if (guildChannels) {
      var thisguild = newMember.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var logsChannel1 = newMember.client.channels.cache.get(
        guildChannels.logsChannel
      );
    } else {
      var logsChannel1 = "0";
    }
    if (logsChannel1 == "0") {
    } else {
      if (oldMember.user.username !== newMember.user.username) {
        try {
          const embed = new Discord.MessageEmbed()
            .setTitle(`Username changed!`)
            .setColor(`RANDOM`)
            .setDescription(oldMember.user)
            .addField(
              `Name changed: `,
              "\n" + oldMember.user.username + "\n" + newMember.user.username
            )
            .setFooter(newMember.user.id)
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
