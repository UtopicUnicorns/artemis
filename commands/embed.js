const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "embed",
  description: "[mod] generate an embed",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("embed");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 6).split("\n");
    message.delete();
    let user = message.guild.members.cache.get(message.author.id);
    let embed = new Discord.MessageEmbed()
      .setAuthor(user.user.username, user.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setColor(`RANDOM`)
      .setTitle(args[0])
      .setDescription(args);
    return message.channel.send({
      embed,
    });
  },
};
