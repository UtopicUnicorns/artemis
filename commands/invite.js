const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
  name: "invite",
  description: "[general] bot invite and main server invite",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const whoartemis = new Discord.MessageEmbed()
      .setTitle("Invite")
      .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
      .setColor("RANDOM")
      .setDescription("Hello, I am Artemis!")
      .addField("Main discord server: ", "https://discord.gg/EVVtPpw")
      .addField("Bot Website: ", "https://artemisbot.eu")
      .addField("Bot Github: ", "https://github.com/UtopicUnicorns/artemis")
      .addField(
        "Bot Invite: ",
        "https://discordapp.com/api/oauth2/authorize?client_id=440892659264126997&permissions=8&scope=bot"
      )
      .addField("Support my work: ", "https://www.patreon.com/utopicunicorn")
      .setFooter("Bot owner: <@127708549118689280> | UtopicUnicorn#0383")
      .setTimestamp();
    return message.channel.send({
      embed: whoartemis
    });
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("invite");
    usage.number++;
    setUsage.run(usage);
    //
  }
};
