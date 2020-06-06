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

    //if old and new pressence are not the same
    if (oldPresence.activities !== newPresence.activities) {
      //if no activities/games
      if (!oldPresence.activities[0]) return;

      //rename activities to shorter thing
      var hello = newPresence.activities;

      //test
      //if (oldPresence.userID == '127708549118689280') console.log(newPresence);

      //loop trough activities
      for (var i = 0; i < hello.length; i++) {
        //if activity name is Twitch
        if (hello[i].name == "Twitch") {
          //define teh guild channels
          const guildChannels = getGuild.get(newPresence.guild.id);

          //if guild channels
          if (guildChannels)
            var thisguild = newPresence.client.guilds.cache.get(
              guildChannels.guild
            );

          //if guild exists or is with Artemis
          if (thisguild) {
            var streamChannel1 = newPresence.client.channels.cache.get(
              guildChannels.streamChannel
            );
            var streamNotif = guildChannels.streamHere;
          } else {
            //return if failure
            return;
          }
          if (guildChannels.streamChannel !== "0") {
            //Pull user from database
            let streamcheck = getScore.get(user.id, newPresence.guild.id);

            //if user does not want notifications
            if (!streamcheck) return;

            //if stream channel exists and guild wants that
            if (streamcheck.stream !== `2`) {
              //prepare database
              let getTimers2 = db.prepare(
                "SELECT * FROM timers WHERE uid = ? AND gid = ? AND bs = 'stream'"
              );

              //define data
              let timersCheck = getTimers2.get(user.id, newPresence.guild.id);

              //if user is not in database for timer
              if (!timersCheck) {
                //define time
                let datefor = moment()
                  .add("7200000", "ms")
                  .format("YYYYMMDDHHmmss");

                //define database entry
                timerset = {
                  mid: Math.random() * 999999,
                  cid: user.user.id,
                  gid: newPresence.guild.id,
                  uid: user.user.id,
                  time: datefor,
                  bs: `stream`,
                };

                //run database
                setTimers.run(timerset);

                //define some stuff
                let TSTA = hello[i].state;
                let TURL = hello[i].url;
                let TDET = hello[i].details;
                let TSID = streamChannel1.id;

                //start request
                request(
                  "https://api.rawg.io/api/games?page_size=5&search=" + TSTA,
                  {
                    json: true,
                  },
                  function (err, res, body) {
                    //if guild wants @here stuff
                    if (streamNotif == "2") streamChannel1.send("@here");

                    //build embed
                    const embed = new Discord.MessageEmbed()
                      .setAuthor(
                        user.user.username,
                        user.user.avatarURL({
                          format: "png",
                          dynamic: true,
                          size: 1024,
                        })
                      )
                      .setTitle(TSTA)
                      .setColor(`RANDOM`)
                      .setURL(TURL)
                      .setDescription(
                        `${user.user}/${user.user.username} went live!`
                      )
                      .addField(TDET, "\n" + TURL)
                      .setTimestamp();

                    //if there is an image
                    if (body.results[0])
                      embed.setImage(`${body.results[0].background_image}`);

                    //send embed
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
              user.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
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
