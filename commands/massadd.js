const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "massadd",
  description: "[Restricted] Mass add a role",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (message.member.permissions.has("KICK_MEMBERS")) {
      //
      let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
      let setUsage = db.prepare(
        "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
      );
      usage = getUsage.get("massadd");
      usage.number++;
      setUsage.run(usage);
      //
      let array = await message.guild.members.map((m) => m);
      let args = message.content.slice(9);
      let role = message.guild.roles.cache.find((r) => r.name === `${args}`);
      console.log(args);
      if (!role) {
        return message.channel.send(`${args} does not exist!`);
      }
      message.channel.send(
        `Adding ${args} to everyone. This may take a while.`
      );
      let str = "";
      for (let i of array) {
        await i.roles.add(role).catch(console.error);
      }
      //LOGS
      const guildChannels = getGuild.get(message.guild.id);
      var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
      if (!logger) {
        var logger = "0";
      }
      if (logger == "0") {
      } else {
        const logsmessage = new Discord.MessageEmbed()
          .setTitle(prefix + "massadd")
          .setAuthor(message.author.username, message.author.avatarURL())
          .setDescription("Used by: " + message.author)
          .setURL(message.url)
          .setColor("RANDOM")
          .addField("Usage:\n", message.content, true)
          .addField("Channel", message.channel, true)
          .setFooter("Message ID: " + message.id)
          .setTimestamp();
        logger
          .send({
            embed: logsmessage,
          })
          .catch((error) =>
            console.log(
              moment().format("MMMM Do YYYY, HH:mm:ss") +
                "\n" +
                __filename +
                ":" +
                ln()
            )
          );
      }
      //
      message.channel.send(`Done! Added ${args} to everyone!`);
      console.log("done");
    }
  },
};
