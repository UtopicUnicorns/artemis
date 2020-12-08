//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "mute",
  description: "[mod] mute MENTION\n[mod]mute 2 m MENTION",
  explain: `This command will mute the user you specify.
The action will create a [Case](#Case).
Do note that without proper role permissions and channel permissions, this command will fail.
This is explained in [Mute_Channel](#Mute_Channel).

Example usage: \`!mute @mention\`

Example usage: \`!mute 5 hour @mention\`

Example usage: \`!mute 5 second @mention\`

Example usage: \`!mute 5 minute @mention\`

Example usage: \`!mute 5 day @mention\``,
  async execute(message) {
    //set prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //update usage count
    usage = getUsage.get("mute");
    usage.number++;
    setUsage.run(usage);

    //define channels
    const guildChannels = getGuild.get(message.guild.id);
    const muteChannel1 = message.guild.channels.cache.get(
      guildChannels.muteChannel
    );

    //create args
    let args = message.content.slice(prefix.length + 5).split(" ");

    //check for logs channel
    var logger = message.guild.channels.cache.get(guildChannels.logsChannel);

    //Check member role
    let memberrole = message.guild.roles.cache.find(
      (r) => r.id === guildChannels.defaultrole
    );

    //define member
    const member = message.mentions.members.first();

    //if no member
    if (!member) return message.reply("Provide a user!");

    //if member is you
    try {
      if (message.author.id == member.id)
        return message.reply("You can not mute yourself");
    } catch {
      return message.reply("Discord API error!");
    }

    //Start after use log function
    function logMe() {
      //If channel exists

      if (logger) {
        //timeout to prevent api spam
        setTimeout(() => {
          const logsmessage = new Discord.MessageEmbed()
            .setTitle(prefix + "mute")
            .setAuthor(
              message.author.username,
              message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setThumbnail(
              message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setDescription("Used by: " + `${message.author}`)
            .setURL(message.url)
            .setColor("#1abc9c")
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
          return message.reply(`${member}` + " is already muted!");
        } else {
          //unblock mute channel
          let channel = message.guild.channels.cache.find(
            (channel) => channel.id === muteChannel1.id
          );
          channel.createOverwrite(member, {
            VIEW_CHANNEL: true,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: false,
          });

          //if there is a members role
          if (memberrole) {
            //timeout to prevent API spam
            setTimeout(() => {
              //Remove member role
              member.roles.remove(memberrole).catch(console.log(""));
            }, 2000);
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
              //notify user and yourself about the mute
              message.reply(
                `${member}` +
                  " is temp muted!\nUser will be unmuted in: " +
                  moment(datefor, "YYYYMMDDHHmmss").fromNow()
              );
              muteChannel1.send(
                `${member}` +
                  ", You have been temp muted!\nYou will be unmuted in: " +
                  moment(datefor, "YYYYMMDDHHmmss").fromNow()
              );
              //AdminCases
              const member22 = message.mentions.members.first();

              //check if database is filled
              let c = getACase.get(message.guild.id);
              if (!c) {
                var caseNum = 1;
              } else {
                let adminCaseCount = db
                  .prepare(
                    "SELECT * FROM admincases WHERE guildid = ? ORDER BY caseid DESC;"
                  )
                  .all(message.guild.id);

                let adminCaseCountCur = adminCaseCount[0].caseid;
                adminCaseCountCur++;
                var caseNum = adminCaseCountCur;
              }

              //Build the case
              adminCase = {
                guildidcaseid: `${message.guild.id}-${caseNum}`,
                caseid: caseNum,
                guildid: message.guild.id,
                userid: member22.id,
                username: `${member22.user.username}#${member22.user.discriminator}`,
                type: `mute`,
                reason: message.content,
                date: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
              };

              //submit the case
              setACase.run(adminCase);
              //notify you
              message.channel.send(
                `${member} has been muted!\nCase: ${caseNum}`
              );
              return logMe();
            }
          }

          //AdminCases
          const member22 = message.mentions.members.first();

          //check if database is filled
          let c = getACase.get(message.guild.id);
          if (!c) {
            var caseNum = 1;
          } else {
            let adminCaseCount = db
              .prepare(
                "SELECT * FROM admincases WHERE guildid = ? ORDER BY caseid DESC;"
              )
              .all(message.guild.id);

            let adminCaseCountCur = adminCaseCount[0].caseid;
            adminCaseCountCur++;
            var caseNum = adminCaseCountCur;
          }

          //Build the case
          adminCase = {
            guildidcaseid: `${message.guild.id}-${caseNum}`,
            caseid: caseNum,
            guildid: message.guild.id,
            userid: member22.id,
            username: `${member22.user.username}#${member22.user.discriminator}`,
            type: `mute`,
            reason: message.content,
            date: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
          };

          //submit the case
          setACase.run(adminCase);

          //run logger
          logMe();

          //notify you
          return message.channel.send(
            `${member} has been muted!\nCase: ${caseNum}`
          );
        }
      }
    }

    //if no member
    if (!member) {
      //create embed
      const logsmessage2 = new Discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setColor("RANDOM")
        .setTitle("Usage")
        .addField(prefix + "mute @mention\n", "Mute a user")
        .addField(
          prefix + "mute X Y @mention\n",
          "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours d/days"
        )
        .addField(prefix + "mute 10 m @mention\n", "example time usage")
        .addField(prefix + "unmute @mention", "Unmutes the target");
      return message.channel.send({
        embed: logsmessage2,
      });
    }

    //if first arg is a number
    if (args[0].match(/^[0-9]+$/) != null) {
      //if second argument is seconds
      if (
        args[1].toLowerCase() == "s" ||
        args[1].toLowerCase() == "sec" ||
        args[1].toLowerCase() == "seconds"
      ) {
        //seconds to miliseconds
        let settime = Math.floor(args[0] * 1000);
        return HitOrMiss(true, settime);
      }

      //if second argument is minutes
      if (
        args[1].toLowerCase() == "m" ||
        args[1].toLowerCase() == "min" ||
        args[1].toLowerCase() == "minutes"
      ) {
        //minutes to miliseconds
        let settime = Math.floor(args[0] * 60000);
        return HitOrMiss(true, settime);
      }

      //if second argument is hours
      if (
        args[1].toLowerCase() == "h" ||
        args[1].toLowerCase() == "hour" ||
        args[1].toLowerCase() == "hours"
      ) {
        //hours to miliseconds
        let settime = Math.floor(args[0] * 3600000);
        return HitOrMiss(true, settime);
      }

      //if second argument is days
      if (
        args[1].toLowerCase() == "d" ||
        args[1].toLowerCase() == "day" ||
        args[1].toLowerCase() == "days"
      ) {
        //days to miliseconds
        let settime = Math.floor(args[0] * 86400000);
        return HitOrMiss(true, settime);
      }

      //invalid arg
      let settime = Math.floor(1 * 3600000);
      return HitOrMiss(true, settime);
    } else {
      //if no time mention
      return HitOrMiss(true);
    }
  },
};
