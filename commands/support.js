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
  execute(message) {
    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
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
