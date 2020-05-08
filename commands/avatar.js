const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "avatar",
  description: "[fun] Show a user avatar",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    let args = message.content.slice(prefix.length + 7).split(" ");
    if (!args[0]) {
      var user = message.guild.members.cache.get(message.author.id);
    }
    if (message.guild.members.cache.get(args[0])) {
      var user = message.guild.members.cache.get(args[0]);
    }
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      var user = message.guild.members.cache.get(message.mentions.users.first().id);
    }
    const embed = new Discord.MessageEmbed()
    .setImage(user.user.displayAvatarURL({ format: 'jpg' }));
    message.channel.send({
      embed: embed,
    });

    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("avatar");
    usage.number++;
    setUsage.run(usage);
    //
  },
};
