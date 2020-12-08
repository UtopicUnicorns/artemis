//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "topic",
  description: "[mod] Set a discussion topic",
  explain: `The topic command is used to change the topic of a situation. When you have no databse entries yet the topics will be selected from a default list.
To add a topic which may match your server you can use \`!topic add {Example topic here}\`. You can view your server topics with the command \`!topic view\`.

Example usage: \`!topic\`

Example usage: \`!topic view\`

Example usage: \`!topic add [Example Topic Here]\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //update usage
    usage = getUsage.get("topic");
    usage.number++;
    setUsage.run(usage);

    //build args
    let args = message.content.slice(prefix.length + 6).split(" ");

    //switch
    switch (args[0].toLowerCase()) {
      case "view":
        //define db
        let topicFind = db
          .prepare(`SELECT * FROM topics WHERE gid = ?`)
          .all(message.guild.id);

        //array
        let str = [];

        //loop
        for (let i of topicFind) {
          str.push(`\`+ ${i.topic}\``);
        }

        //if nothing
        if (str.length < 1)
          return message.reply("Something went wrong, sorry.");

        //send
        return message.channel.send(str.join("\n"), {
          split: true,
        });
        break;

      case "add":
        //build args
        let args2 = message.content.slice(prefix.length + 10);

        if (!args2) return message.reply("Please do provide a topic!");

        //define db
        topicAdd = {
          gidtopic: `${message.guild.id}-${args2}`,
          gid: message.guild.id,
          topic: args2,
        };

        //run database
        setTopics.run(topicAdd);

        return message.reply("Done!");
        break;
    }

    //select topics
    const topicsInit = getTopics.get(message.guild.id);

    if (!topicsInit) {
      //subjects
      var selectthis = [
        "Which Linux distribution did you first use,\nand why did you start using it?",
        "Do you have a favourite Linux/UNIX command?\nUse `" +
          prefix +
          "man command` to know what a command does, never use commands you do not know.",
        "Are you currently dual booting another OS or distribution,\nwhy do you dual boot, or why do you not?",
        "Do you know any programming languages,\nand which one is your favourite?",
        "Which games do you usually play,\nand are they available on Linux?",
        "Do you have any safety tips for others to know regarding the Corona virus?",
        "What made you interested in Linux Mint?",
        "What is your favorite editor?",
        "Do you prefer using the terminal or a gui?",
        "What distribution made you stop 'distro' hopping, why?\nIf you distro hop what distribution are you considering next, why?",
        "What is your biggest pet peeve with linux?",
        "What is the oddest thing you have put linux on?",
        "What is your favourite desktop environment or/and window manager?",
        "What is a handy lesser known terminal command?",
        "Mechanical or membrane keyboard? Why?",
        "Do you know any games that run exceptionally well on Linux?",
        "Which distributions have you tried before, and which one suited you the best and which one the worst, elaborate your answer.",
      ];
    } else {
      //define db
      let topicFind = db
        .prepare(`SELECT * FROM topics WHERE gid = ?`)
        .all(message.guild.id);

      //array
      var selectthis = [];

      //loop
      for (let i of topicFind) {
        selectthis.push(i.topic);
      }

      //if nothing
      if (selectthis.length < 1)
        return message.reply("Something went wrong, sorry.");
    }

    //pick a random subject
    let selectedthis = selectthis[~~(Math.random() * selectthis.length)];

    //change channel topic to subject
    message.client.channels.cache
      .get(message.channel.id)
      .setTopic(selectedthis);

    //create embed
    const topicstart = new Discord.MessageEmbed()
      .setAuthor(
        message.author.username,
        message.author.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setColor("RANDOM")
      .setDescription(
        "For the next 30 minutes this will be the topic!\nTrying to go off-topic may have consequences."
      )
      .addField("The topic that I have selected for you is: \n", selectedthis)
      .setFooter("Behave properly, and respect each others opinions.\n")
      .setTimestamp();

    //send embed
    message.channel.send({
      embed: topicstart,
    });
  },
};
