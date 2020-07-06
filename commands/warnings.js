//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "warnings",
  description: "[mod] Look up user warning",
  explain: `Using this command without arguments will show a top 25 of warning holders along with the latest provided reason.\n
  Using \`warnings @mention\` will show a small log of the user mentioned.\n
  Using \`warnings reset @mention\` will reset the warning points for the user.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("warnings");
    usage.number++;
    setUsage.run(usage);

    //form user
    const user = message.mentions.users.first();

    //if no user
    if (!user) {
      //pull data
      const getstuff = db
        .prepare(
          "SELECT * FROM scores WHERE guild = ? ORDER BY warning DESC LIMIT 24;"
        )
        .all(message.guild.id);

      //form embed
      const embed = new Discord.MessageEmbed().setColor("RANDOM");

      //loop trough data
      for (const data of getstuff) {
        //if user exist and has over 1 warning point
        if (message.guild.members.cache.get(data.user) && data.warning > 0) {
          //define user
          let user = message.guild.members.cache.get(data.user);

          //add field with info
          embed.addField(
            `\u200b`,
            `${user} / ${user.user.username}\nWarnings: ${data.warning} | Reason: ${data.notes}`
          );
        }
      }

      //send embed
      message.channel.send({
        embed,
      });
    }

    //pull user data
    const userscore = getScore.get(user.id, message.guild.id);

    //if no data
    if (!userscore) return message.reply("This user has no entry!");

    //define status
    if (userscore.muted == `1`) {
      var isMuted = "yes";
    } else {
      var isMuted = "no";
    }

    //if reset
    if (message.content.includes("reset")) {
      //clear warning
      userscore.warning = 0;

      //run database
      setScore.run(userscore);

      //notify
      return message.channel.send(
        "Warnings for this user have been reset to 0!"
      );
    }

    //form embed
    const embeds = new Discord.MessageEmbed()
      .setAuthor(user.username, user.displayAvatarURL({ format: "jpg" }))
      .setDescription(user)
      .setColor("RANDOM")
      .addField("Warnings: ", userscore.warning)
      .addField("Latest reason: ", userscore.notes)
      .addField("Muted? ", isMuted)
      .setFooter(user.id);

    //send embed
    message.channel.send({
      embed: embeds,
    });
  },
};
