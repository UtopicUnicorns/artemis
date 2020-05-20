const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "userinfo",
  description: "[general] Displays your own or mentioned user info",
  execute(message) {
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix.toString();
    //
    usage = getUsage.get("userinfo");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 9).split(" ");
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
    let entryYes = getSpecs.get(user.user.id);
    let roleMap = [];
    user.roles.cache.forEach((role) => roleMap.push(role));
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        user.user.username + "#" + user.user.discriminator,
        user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
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
      .setThumbnail(user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .addField(
        "Joined at: ",
        moment.utc(user.user.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField("Status:", user.user.presence.status)
      .addField(
        "Created at: ",
        moment
          .utc(user.user.createdTimestamp)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField("Roles:", `${roleMap}`);
    if (entryYes) {
      embed.addField("Specifications:\n", `${getSpecs.get(user.user.id).spec}`);
    } else {
      embed.addField(
        "Specifications:\n",
        `User has not added their specifications.\nTo add your own specs use ${prefix}specs`
      );
    }
    message.channel.send(embed);
    return;
  },
};
