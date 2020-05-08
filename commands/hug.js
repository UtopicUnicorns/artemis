const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "hug",
  description: "[fun] Hug someone",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    let user = message.mentions.users.first();
    if (!user) return;
    let selectthis = [
      "https://media.giphy.com/media/HZzrAS6wkvcVW/giphy.gif",
      "https://media1.tenor.com/images/94989f6312726739893d41231942bb1b/tenor.gif",
      "https://media1.tenor.com/images/4d89d7f963b41a416ec8a55230dab31b/tenor.gif",
      "https://media1.tenor.com/images/f5df55943b64922b6b16aa63d43243a6/tenor.gif",
      "https://media1.tenor.com/images/684efd91473dcfab34cb78bf16d211cf/tenor.gif",
    ];
    let hugsel = selectthis[~~(Math.random() * selectthis.length)];
    const embed = new Discord.MessageEmbed()
      .setTitle(message.author.username + " hugs " + user.username)
      .setImage(hugsel);
    message.channel.send({
      embed: embed,
    });
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("hug");
    usage.number++;
    setUsage.run(usage);
    //
  },
};
