//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "warn",
  description: "[mod] Warn a user",
  explain: `This command will warn a user,  and will also generate a [Case](#Case).
When a user is warned ,the warning point table for the user will increase by 1.
When a user has 3 or more warning points, with a properly set up muting channel, and the \`~/Members\` role has been properly applied to the channels, the user will be muted.

Example usage: \`!warn @mention [Reason]\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //form guild channels
    const guildChannels = getGuild.get(message.guild.id);

    //form mute channel
    var muteChannel1 = message.guild.channels.cache.get(
      guildChannels.muteChannel
    );

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //update usage
    usage = getUsage.get("warn");
    usage.number++;
    setUsage.run(usage);

    //form user
    const user = message.mentions.users.first();

    //if no user
    if (!user) return message.reply("You must mention someone!");

    //form args
    const args = message.content.slice(prefix.length + user.id.length + 10);

    //if no args
    if (!args) {
      var warningtext = "No reason given.";
    } else {
      var warningtext = args;
    }

    //add warning point
    const pointsToAdd = parseInt(1, 10);

    //pull user data
    let userscore = getScore.get(user.id, message.guild.id);

    //if no user
    if (!userscore) {
      userscore = {
        id: `${message.guild.id}-${user.id}`,
        user: user.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };
    }

    //add warning text
    userscore.notes = warningtext;

    //add warning point
    userscore.warning += pointsToAdd;

    //if user has over 2 warnings
    if (userscore.warning > 2) {
      //define member
      const member = message.mentions.members.first();

      //if channel
      if (muteChannel1) {
        //unblock mute channel
        let channel = message.guild.channels.cache.find(
          (channel) => channel.id === muteChannel1.id
        );

        //Overwrite channel
        channel.createOverwrite(member, {
          VIEW_CHANNEL: true,
          READ_MESSAGES: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true,
          ATTACH_FILES: false,
        });
        channel.send(
          `${member}` + "\nYou collected 3 warnings, you have been muted!"
        );
      }

      //fetch role
      let memberrole = message.guild.roles.cache.find(
        (r) => r.name === `~/Members`
      );

      //if member role
      if (memberrole) {
        //anti api spam
        setTimeout(() => {
          //remove role
          member.roles.remove(memberrole).catch(console.log(""));
        }, 2500);
      }

      //set muted to yes
      userscore.muted = `1`;
    }

    //run database
    setScore.run(userscore);

    //AdminCases
    const member = message.mentions.members.first();

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
      userid: member.id,
      username: `${member.user.username}#${member.user.discriminator}`,
      type: `warn`,
      reason: message.content,
      date: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
    };

    //submit the case
    setACase.run(adminCase);

    //form guild channels
    const guildChannels2 = getGuild.get(message.guild.id);

    //form logs channel
    var logger = message.guild.channels.cache.get(guildChannels2.logsChannel);

    //if no log channel
    if (!logger) var logger = "0";

    //if logs channel
    if (logger !== "0") {
      //anti api spam
      setTimeout(() => {
        //form embed
        const logsmessage = new Discord.MessageEmbed()
          .setTitle(prefix + "warn")
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
          .setColor("#e74c3c")
          .addField("Usage:\n", message.content, true)
          .addField("Channel", message.channel, true)
          .setFooter("Message ID: " + message.id)
          .setTimestamp();

        //send embed
        logger
          .send({
            embed: logsmessage,
          })
          .catch((error) =>
            //error
            console.log(
              moment().format("MMMM Do YYYY, HH:mm:ss") +
                "\n" +
                __filename +
                ":" +
                ln()
            )
          );
      }, 3500);
    }

    //send warning message
    return message.channel.send(
      `${user} has been warned!\nYou have ${userscore.warning} warning(s)\nCase: ${caseNum}`
    );
  },
};
