//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "ban",
  description: "[mod] Ban a user",
  explain: `Using this command will try to ban a user or users. 
Do note that Artemis needs valid permissions, and needs to be above the user in the role hierachy.
Using this command will also create a [Case](#Case).

Example usage: \`!ban @mention [Reason for the ban]\`

Example usage: \`!ban @mention @mention @mention\`

Example usage: \`!ban userID userID userID\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `BAN_MEMBERS` permission."
      );

    //update usage
    usage = getUsage.get("ban");
    usage.number++;
    setUsage.run(usage);

    //args
    let args = message.content.slice(prefix.length + 4).split(" ");

    //if no args
    if (!args[0])
      return message.reply("You need to mention the user you wish to ban!");

    //loop
    for (let i of args) {
      //return just numbers
      let numbers = i.replace(/[^0-9]/gi, "");

      //form member
      let member = await message.guild.members.cache.get(numbers);

      if (!member) {
        try {
          await message.guild.members.ban(numbers);
          message.reply(`Pre-emptively banned: <@${numbers}>`);
        } catch {
          console.log("");
        }
      }

      if (numbers == message.author.id)
        return message.reply("Let's not ban ourselves, shall we?");

      //if member
      if (member) {
        await member.ban({ days: 7, reason: "Artemis Rules!" });

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
          userid: member.user.id,
          username: `${member.user.username}#${member.user.discriminator}`,
          type: `ban`,
          reason: message.content,
          date: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
        };

        //submit the case
        setACase.run(adminCase);

        message.reply(`${member} has been banned!\nCase: ${caseNum}`);
      }
    }

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
          .setTitle(prefix + "ban")
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
          .setColor("#f0f3f4")
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
  },
};
