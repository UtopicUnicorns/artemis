//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "ban",
  description: "[mod] Ban a user",
  explain: `\`ban @mention\`\nWill surely ban a user if the bot is able to, this depends on the permissions and hierarchy of the roles.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("ban");
    usage.number++;
    setUsage.run(usage);

    //define member
    const member = message.mentions.members.first();

    //if no user
    if (!member)
      return message.reply("You need to mention the user you wish to ban!");

    //ban the user
    member.ban();
    message.reply(`${member} has been banned!`);

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
      }, 3500);
    }
  },
};
