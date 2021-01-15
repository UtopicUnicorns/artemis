//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "userinfo",
  description: "[general] Displays your own or mentioned user info",
  explain: `This command will show you detailed info about yourself, or a specified user.
It can also be used in combination with [Specs](#Specs) to share your system info.

Example usage: \`!userinfo\`

Example usage: \`!userinfo @mention\`

Example usage: \`!userinfo userID\``,
  execute(message) {
    //form prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix.toString();

    //update usage
    usage = getUsage.get("userinfo");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 9).split(" ");

    //form user
    if (!args[0]) {
      var user = message.guild.members.cache.get(message.author.id);
    }
    if (message.guild.members.cache.get(args[0])) {
      var user = message.guild.members.cache.get(args[0]);
    }
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      var user = message.guild.members.cache.get(
        message.mentions.users.first().id
      );
    }

    //array
    let roleMap = [];

    //push roles into array
    user.roles.cache.forEach((role) => roleMap.push(role));

    //form embed
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        user.user.username + "#" + user.user.discriminator,
        user.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setDescription(
        "User ID: " +
          user.user.id +
          "\nUser: " +
          `${user}` +
          "\nNickname: " +
          user.nickname +
          "\nIs bot: " +
          user.user.bot
      )
      .setColor(`RANDOM`)
      .setThumbnail(
        user.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .addField(
        "Joined at: ",
        moment.utc(user.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField("Status:", user.user.presence.status)
      .addField(
        "Created at: ",
        moment
          .utc(user.user.createdTimestamp)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField("Roles:", `${roleMap.slice(0, 20)}`);

    //send embed
    return message.channel.send(embed);
  },
};
