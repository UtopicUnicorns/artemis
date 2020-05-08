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
    console.log(ln());
    if (!args[0]) {
      var user = message.guild.members.cache.get(message.author.id);
      console.log(ln());
    }
    if (message.guild.members.cache.get(args[0])) {
      var user = message.guild.members.cache.get(args[0]);
    }
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      var user = message.guild.members.cache.get(message.mentions.users.first().id);
    }
    let entryYes = getSpecs.get(user.user.id);
    console.log(ln());
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        user.user.username + "#" + user.user.discriminator,
        user.user.displayAvatarURL({ format: 'jpg' })
      )
      .setDescription(
        "User ID: " +
          user.user.id +
          "\nUser: " +
          user +
          "\nNickname: " +
          user.user.nickname +
          "\nIs bot: " +
          user.user.bot
      )
      .setColor(`RANDOM`)
      .setThumbnail(user.user.displayAvatarURL({ format: 'jpg' }))
      .addField(
        "Joined at: ",
        moment
          .utc(user.user.joinedAt)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField("Status:", user.user.presence.status)
      .addField(
        "Created at: ",
        moment
          .utc(user.user.createdTimestamp)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField(
        "Roles:",
        message.guild.cache
          .member(user)
          .roles.map((r) => r)
          .join(" ")
      );
    if (entryYes) {
      embed.addField("Specifications:\n", `${getSpecs.get(user.user.id).spec}`);
    } else {
      embed.addField(
        "Specifications:\n",
        `User has not added their specifications.\nTo add your own specs use ${prefix}specs`
      );
    }
    message.channel.send(embed);
    console.log(ln());
    return;
  },
};
