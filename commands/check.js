const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "check",
  description: "[server] Role check",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (message.member.hasPermission("KICK_MEMBERS")) {
      //
      let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
      let setUsage = db.prepare(
        "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
      );
      usage = getUsage.get("check");
      usage.number++;
      setUsage.run(usage);
      //
      const args = message.content.slice(prefix.length + 6).split(" ");
      const cargs = message.content.slice(prefix.length + 10);
      if (!args)
        return message.reply("Provide 2 more args not/yes + idrole namerole");
      if (args[0] == "not") {
        let array = await message.guild.members.map((m) => m);
        let str = "";
        for (let i of array) {
          if (
            !i.roles.find((r) => r.name === cargs) ||
            i.roles.find((r) => r.id === cargs)
          ) {
            str += i + "\n";
          }
        }
        let role =
          message.guild.roles.cache.find((r) => r.id === cargs) ||
          message.guild.roles.cache.find((r) => r.name === cargs);
        try {
          const check = new Discord.MessageEmbed()
            .setTitle("RoleCheck")
            .setColor("RANDOM")
            .addField("These users do not have: ", role + "\n\n" + str)
            .setTimestamp();
          return message.channel.send({
            embed: check,
          });
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
      if (args[0] == "yes") {
        let array = await message.guild.members.map((m) => m);
        let str = "";
        for (let i of array) {
          if (
            i.roles.find((r) => r.name === cargs) ||
            i.roles.find((r) => r.id === cargs)
          ) {
            str += i + "\n";
          }
        }
        let role =
          message.guild.roles.cache.find((r) => r.id === cargs) ||
          message.guild.roles.cache.find((r) => r.name === cargs);
        try {
          const check = new Discord.MessageEmbed()
            .setTitle("RoleCheck")
            .setColor("RANDOM")
            .addField("These users have: ", role + "\n\n" + str)
            .setTimestamp();
          return message.channel.send({
            embed: check,
          });
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
    }
  },
};
