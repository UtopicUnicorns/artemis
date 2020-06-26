//start modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "support",
  description: "[mod] Set a support channel",
  explain: `This command allows you to view, modify and answer support tickets.\n
  \`support view CaseNUM\` will show you the support ticket linked to this number.\n
  \`support answer caseNUM\` will add your answer to the ticket number, everything that comes after this command in the same message will count as an answer.\n
  \`support user @mention\` will show the last 25 tickets of a user.\n
  \`support user userID\` will show the last 25 tickets of a user.`,
  execute(message) {
    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage
    usage = getUsage.get("support");
    usage.number++;
    setUsage.run(usage);

    //build args
    const args = message.content.slice(prefix.length + 8).split(" ");

    //If no args
    if (!args[0]) {
      return message.reply(
        "Simply type `help` to start a session if you are in a support channel\n" +
          "Then write `done` when you received the help!\n" +
          "To resume a session write `resume caseNum`\n" +
          "To fill out a proper answer for the case use:\n`" +
          prefix +
          "support answer caseNum <answer>`"
      );
    }

    //Answer
    if (args[0].toLowerCase() == "answer") {
      //get the case entry
      let prevCaseGet = getSupCase.get(args[1]);

      //if no entry
      if (!prevCaseGet) return message.reply("Invalid case number.");

      //run answer
      prevCaseGet.solveby = message.author.id;
      prevCaseGet.answer = args.slice(2).join(" ");
      setSupCase.run(prevCaseGet);

      //reply
      return message.reply("Answer submitted!");
    }

    //edit question
    //Answer
    if (args[0].toLowerCase() == "question") {
      //get the case entry
      let prevCaseGet = getSupCase.get(args[1]);

      //if no entry
      if (!prevCaseGet) return message.reply("Invalid case number.");

      //run answer
      prevCaseGet.question = args.slice(2).join(" ");
      setSupCase.run(prevCaseGet);

      //reply
      return message.reply("Question altered!");
    }

    //View user
    if (args[0].toLowerCase() == "user") {
      //redefine args
      let sargs = message.content.slice(prefix.length + 13).split(" ");

      //form user
      if (!sargs[0]) {
        var user = message.guild.members.cache.get(message.author.id);
      }
      if (message.guild.members.cache.get(sargs[0])) {
        var user = message.guild.members.cache.get(sargs[0]);
      }
      if (sargs[0].startsWith("<@") && sargs[0].endsWith(">")) {
        var user = message.guild.members.cache.get(
          message.mentions.users.first().id
        );
      }

      //get cases by user
      let casesGet = db
        .prepare("SELECT * FROM supcase WHERE askby = ? LIMIT 25;")
        .all(user.user.id);

      //build embed
      const supTic5 = new Discord.MessageEmbed()
        .setTitle(`Viewing past cases for ${user.user.username}`)
        .setAuthor(
          user.user.username + "#" + user.user.discriminator,
          user.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setDescription("Use " + prefix + "support view CaseNum")
        .setColor("RANDOM")
        .setTimestamp();

      //loop trough data
      for (let data of casesGet) {
        let q = data.question.toString();
        supTic5.addField(
          "Case number: " + data.scase,
          "Question: " + q.slice(0, 20)
        );
      }

      //send embed
      return message.reply({
        embed: supTic5,
      });
    }

    //view
    if (args[0].toLowerCase() == "view") {
      //get the case entry
      let prevCaseGet = getSupCase.get(args[1]);

      //if no entry
      if (!prevCaseGet) return message.reply("Invalid case number.");

      //define user
      let user = message.guild.members.cache.get(prevCaseGet.askby);

      const supTic4 = new Discord.MessageEmbed()
        .setTitle("Support case: " + prevCaseGet.scase)
        .setAuthor(
          user.user.username + "#" + user.user.discriminator,
          user.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setDescription("Viewing case")
        .addField("Asked by: ", `${user}`)
        .addField("Context link: ", prevCaseGet.murl)
        .addField("Question: ", prevCaseGet.question)
        .addField("\u200b", "\u200b")
        .addField("Answer: ", prevCaseGet.answer)
        .setColor("RANDOM")
        .setTimestamp();

      //send support embed
      return message.reply({
        embed: supTic4,
      });
    }

    //reject non mods after this point
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //add or delete support channel
    if (args[0].toLowerCase() == "set") {
      let cCheck = getSupport.get(message.channel.id, message.guild.id);
      if (!cCheck) {
        cCheck = {
          cid: message.channel.id,
          gid: message.guild.id,
          inuse: `0`,
        };
        setSupport.run(cCheck);
        return message.reply(
          "Added: " + message.channel + " to the support channel list!"
        );
      } else {
        db.prepare(
          `DELETE FROM support WHERE cid = '${message.channel.id}' AND gid = '${message.guild.id}'`
        ).run();
        return message.reply(
          "Removed: " + message.channel + " from the support channel list!"
        );
      }
    }

    //Load support channels available in guild
    const supC = db
      .prepare("SELECT * FROM support WHERE gid = ?;")
      .all(message.guild.id);
    let array2 = [];
    for (const data of supC) {
      array2.push(
        message.guild.channels.cache.find((channel) => channel.id === data.cid)
      );
    }
    const embed = new Discord.MessageEmbed()
      .setTitle("Current support channels")
      .setColor("RANDOM")
      .setDescription(
        "usage:\n" +
          "Use in channel you want assigned/removed as support channel\n" +
          prefix +
          "support set" +
          "\n\nUse in support channel when support is done\n`done`"
      )
      .addField("Support channels of this server: ", array2.join("\n"));
    return message.channel.send({
      embed,
    });

    //next
  },
};
