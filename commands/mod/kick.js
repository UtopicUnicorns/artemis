//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "kick",
  description: "[mod] Kick a user from the server",
  explain: `This command will attempt to kick the user you specify.
To properly use this command, make sure that Artemis is in a higher role hierachy slot than the user you try to kick.
Using this command will also generate a [Case](#Case).

Example usage: \`!kick @mention\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `KICK_MEMBERS` permission."
      );

    //update usage
    usage = getUsage.get("kick");
    usage.number++;
    setUsage.run(usage);

    //args
    let args = message.content.slice(prefix.length + 5);

    //define member
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    //if no user
    if (!member) {
      return message.reply("You need to mention the member you want to kick!");
    }

    //if can't kick
    if (!member.kickable) {
      return message.reply("I can't kick this user.");
    }

    //build guild channels
    const guildChannels = getGuild.get(message.guild.id);

    //pull log channel
    var logger = message.guild.channels.cache.get(guildChannels.logsChannel);

    //if no logs channel
    if (!logger) var logger = "0";

    //if logchannel is not 0
    if (logger !== "0") {
      //build embed
      const logsmessage = new Discord.MessageEmbed()
        .setTitle(prefix + "kick")
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
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
        .setColor("#fdedec")
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
      type: `kick`,
      reason: message.content,
      date: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
    };

    //submit the case
    setACase.run(adminCase);

    //Kick member
    return member
      .kick()
      .then(() =>
        message.reply(`${member.user.tag} was kicked.\nCase: ${caseNum}`)
      )
      .catch((error) => message.reply("Sorry, an error occured."));
  },
};
