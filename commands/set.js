//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

module.exports = {
  name: "set",
  description:
    "[mod] set mute MENTION" +
    "\n[mod] set mute time 10 s/m/h MENTION" +
    "\n[mod] set unmute MENTION" +
    "\n[mod] set prefix prefix",
  async execute(message) {
    //set prefix
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    if (message.member.permissions.has("KICK_MEMBERS")) {
      //update usage count
      usage = getUsage.get("set");
      usage.number++;
      setUsage.run(usage);

      //define channels
      const guildChannels = getGuild.get(message.guild.id);
      const muteChannel1 = message.guild.channels.cache.get(
        guildChannels.muteChannel
      );

      //create args
      let args = message.content.slice(prefix.length + 4).split(" ");

      //check for logs channel
      var logger = message.guild.channels.cache.get(guildChannels.logsChannel);

      //Check member role
      let memberrole = message.guild.roles.cache.find(
        (r) => r.name === `~/Members`
      );

      //define member
      const member = message.mentions.members.first();

      //Start after use log function
      function logMe() {
        //If channel exists

        if (logger) {
          //timeout to prevent api spam
          setTimeout(() => {
            const logsmessage = new Discord.MessageEmbed()
              .setTitle(prefix + "set")
              .setAuthor(
                message.author.username,
                message.author.avatarURL({ format: "jpg" })
              )
              .setDescription("Used by: " + `${message.author}`)
              .setURL(message.url)
              .setColor("RANDOM")
              .addField("Usage:\n", message.content, true)
              .addField("Channel", message.channel, true)
              .setFooter("Message ID: " + message.id)
              .setTimestamp();
            logger.send({
              embed: logsmessage,
            });
          }, 3500);
        }
      }

      //main mute/unmute function
      async function HitOrMiss(isMuted, isTime) {
        //Return if no member
        if (!member) return message.channel.send("Mention a user!");

        //return if you are your own target
        if (message.author.id == member.id)
          return message.reply("You can not mute yourself");

        //if func arg is true
        if (isMuted == true) {
          //load up score
          let userscore = getScore.get(member.id, message.guild.id);

          //return if user is already muted
          if (userscore.muted == `1`) {
            return message.reply(member + " is already muted!");
          } else {
            //create array to fetch stuff
            let array = [];

            //push channels into the array
            message.client.channels.cache
              .filter((channel) => channel.guild.id === message.guild.id)
              .map((channels) => array.push(channels.id));

            //counter
            let count = "0";

            //start array loop
            for (let i of array) {
              //update count
              count++;

              //timeout to prevent api spam
              setTimeout(() => {
                //define channel
                let channel = message.guild.channels.cache.find(
                  (channel) => channel.id === i
                );

                //if channel exists
                if (channel) {
                  //if there is a mute channel
                  if (muteChannel1) {
                    //if current loop is mute channel
                    if (i == muteChannel1.id) {
                      //give proper perms
                      channel.createOverwrite(member, {
                        VIEW_CHANNEL: true,
                        READ_MESSAGES: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ATTACH_FILES: false,
                      });
                      return channel.send(member + "\nYou have been muted!");
                    }
                  }

                  //give proper perms for teh rest of teh channels
                  channel.createOverwrite(member, {
                    VIEW_CHANNEL: false,
                    READ_MESSAGES: false,
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    ADD_REACTIONS: false,
                  });
                }
              }, 200 * count);
            }

            //if there is a members role
            if (memberrole) {
              //timeout to prevent API spam
              setTimeout(() => {
                //Remove member role
                member.roles.remove(memberrole).catch(console.log());
              }, 10000);
            }

            //define userscore again
            let userscore = getScore.get(member.id, message.guild.id);

            //if no userscore create it
            if (!userscore) {
              userscore = {
                id: `${message.guild.id}-${member.id}`,
                user: member.id,
                guild: message.guild.id,
                points: 0,
                level: 1,
                warning: 0,
                muted: 1,
                translate: 0,
                stream: 0,
                notes: 0,
              };
            }

            //set userscore muted to true/1
            userscore.muted = `1`;

            //push into the database
            setScore.run(userscore);

            //If there is a time defined
            if (isTime) {
              //convert ms to nice time
              let datefor = moment().add(isTime, "ms").format("YYYYMMDDHHmmss");

              //construct database entry
              timerset = {
                mid: message.id,
                cid: message.channel.id,
                gid: message.guild.id,
                uid: member.id,
                time: datefor,
                bs: `mute`,
              };

              //push into database
              setTimers.run(timerset);

              //if there is a mute channel
              if (muteChannel1) {
                try {
                  //notify user and yourself about the mute
                  message.reply(
                    member +
                      " is temp muted!\n" +
                      moment(datefor, "YYYYMMDDHHmmss").fromNow()
                  );
                  muteChannel1.send(
                    member +
                      ", You have been temp muted!\n" +
                      moment(datefor, "YYYYMMDDHHmmss").fromNow()
                  );
                  return logMe();
                } catch {
                  return logMe();
                }
              }
            }

            //run logger
            logMe();

            try {
              //notify you
              message.channel.send(member + " has been muted!");
              return logMe();
            } catch {
              return logMe();
            }
          }
          //If false unmute
        } else {
          //define userscore
          let userscore = getScore.get(member.id, message.guild.id);

          //if user is not muted return
          if (userscore.muted == `0`)
            return message.channel.send(member + " Is not muted!");

          //check if role exists
          if (memberrole) {
            //add member role
            setTimeout(() => {
              //Remove member role
              member.roles.add(memberrole).catch(console.error);
            }, 10000);
          }

          //look an array fetcher
          let array2 = [];

          //push channels into array
          message.client.channels.cache
            .filter((channel) => channel.guild.id === message.guild.id)
            .map((channels) => array2.push(channels.id));

          //start array loop
          for (let i of array2) {
            //timeout to prevent API spam
            setTimeout(() => {
              //define channel
              let channel = message.guild.channels.cache.find(
                (channel) => channel.id === i
              );

              //if channel exists
              if (channel) {
                //if member is in the current channel permission list
                if (channel.permissionOverwrites.get(member.id)) {
                  //remove member from channel list
                  channel.permissionOverwrites.get(member.id).delete();
                }
              }
            }, 200);
          }

          //Set muted score to false/0
          userscore.muted = `0`;

          //reset warnings
          userscore.warning = `0`;

          //run database
          setScore.run(userscore);
          try {
            message.reply(member + " has been unmuted!");
            return logMe();
          } catch {
            message.reply(member + " has been unmuted!");
            return logMe();
          }
        }
      }
      //mute
      if (args[0] == `mute`) {
        //if no member has been defined
        if (!member) {
          //create embed
          const logsmessage2 = new Discord.MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.avatarURL({ format: "jpg" })
            )
            .setColor("RANDOM")
            .setTitle("Usage")
            .addField(prefix + "set mute @mention\n", "Mute a user")
            .addField(
              prefix + "set mute time X Y @mention\n",
              "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours d/days"
            )
            .addField(
              prefix + "set mute time 10 m @mention\n",
              "example time usage"
            )
            .addField(prefix + "set unmute @mention", "Unmutes the target");
          return message.channel.send({
            embed: logsmessage2,
          });
        }

        //if the target is you
        if (message.author.id == member.id)
          return message.reply("You can not mute yourself");

        //if second argument is time
        if (args[1] == `time`) {
          //if no third argument
          if (!args[2]) {
            //construct embed
            const logsmessage2 = new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.avatarURL({ format: "jpg" })
              )
              .setColor("RANDOM")
              .setTitle("Usage")
              .addField(prefix + "set mute @mention\n", "Mute a user")
              .addField(
                prefix + "set mute time X Y @mention\n",
                "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours d/days"
              )
              .addField(
                prefix + "set mute time 10 m @mention\n",
                "example time usage"
              )
              .addField(prefix + "set unmute @mention", "Unmutes the target");
            return message.channel.send({
              embed: logsmessage2,
            });
          }

          //if no fourth argument
          if (!args[3]) {
            //construct embed
            const logsmessage2 = new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.avatarURL({ format: "jpg" })
              )
              .setColor("RANDOM")
              .setTitle("Usage")
              .addField(prefix + "set mute @mention\n", "Mute a user")
              .addField(
                prefix + "set mute time X Y @mention\n",
                "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours d/days"
              )
              .addField(
                prefix + "set mute time 10 m @mention\n",
                "example time usage"
              )
              .addField(prefix + "set unmute @mention", "Unmutes the target");
            return message.channel.send({
              embed: logsmessage2,
            });
          }

          //if fourth argument is seconds
          if (
            args[3].toLowerCase() == "s" ||
            args[3].toLowerCase() == "sec" ||
            args[3].toLowerCase() == "seconds"
          ) {
            //seconds to miliseconds
            let settime = Math.floor(args[2] * 1000);
            return HitOrMiss(true, settime);
          }

          //if fourth argument is minutes
          if (
            args[3].toLowerCase() == "m" ||
            args[3].toLowerCase() == "min" ||
            args[3].toLowerCase() == "minutes"
          ) {
            //minutes to miliseconds
            let settime = Math.floor(args[2] * 60000);
            return HitOrMiss(true, settime);
          }

          //if fourth argument is hours
          if (
            args[3].toLowerCase() == "h" ||
            args[3].toLowerCase() == "hour" ||
            args[3].toLowerCase() == "hours"
          ) {
            //hours to miliseconds
            let settime = Math.floor(args[2] * 3600000);
            return HitOrMiss(true, settime);
          }

          //if fourth argument is days
          if (
            args[3].toLowerCase() == "d" ||
            args[3].toLowerCase() == "day" ||
            args[3].toLowerCase() == "days"
          ) {
            //days to miliseconds
            let settime = Math.floor(args[2] * 86400000);
            return HitOrMiss(true, settime);
          }
        }

        //if no time argument, ignore time and just pass normal mute
        return HitOrMiss(true);
      }

      //unmute
      if (args[0] == `unmute`) {
        //trigger unmute
        return HitOrMiss(false);
      }

      //prefix
      if (args[0] == `prefix`) {
        //if no second arguments
        if (!args[1]) return message.channel.send(`Specify a prefix!!`);

        //define arguments for prefix
        let zwargs = message.content.slice(prefix.length + 11);

        //put new prefix in the database
        prefixstart.prefix = zwargs;

        //run database
        setGuild.run(prefixstart);

        //notify user
        message.channel.send("Prefix set to " + zwargs);
        //LOGS
        if (logger == "0") {
        } else {
          logMe();
        }
      }
    }
  },
};
