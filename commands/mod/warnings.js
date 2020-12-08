//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "warnings",
  description: "[mod] Look up user warning",
  explain: `This command allows you to see how many warnings a user has and what the latest reason of a warn was.
It will also show if a user has been muted.
An additional usage of this command is that it can reset warnings to 0.

Example usage: \`!warnings\`

Example usage: \`!warnings @mention\`

Example usage: \`!warnings @mention reset\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

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
