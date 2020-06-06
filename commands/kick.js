//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "kick",
  description: "[mod] Kick a user from the server",
  explain: `This command will surely kick an @mentioned user.\n
  This will only kick the user, it does not ban, mute or whatever to the user.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user has no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("kick");
    usage.number++;
    setUsage.run(usage);

    //define member
    const member = message.mentions.members.first();

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
        .setDescription("Used by: " + `${message.author}`)
        .setURL(message.url)
        .setColor("RANDOM")
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

    //Kick member
    return member
      .kick()
      .then(() => message.reply(`${member.user.tag} was kicked.`))
      .catch((error) => message.reply("Sorry, an error occured."));
  },
};
