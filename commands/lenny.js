const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "lenny",
  description: "[fun] ( ͡° ͜ʖ ͡°)",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("lenny");
    usage.number++;
    setUsage.run(usage);
    //
    if (message.channel.id === "701399878412140544" || message.channel.id === "702267558195232868") {
      let args = message.content.slice(prefix.length + 6).split(" ");
      if (!args[0]) {
        let num = Math.floor(Math.random() * 1424 + 1);
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/ecchi/" + num + ".jpg"
        );
        return message.channel.send({
          embed: embed,
        });
      }
      if (args[0].match(/^[0-9]+$/) != null) {
        let num = args[0];
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/ecchi/" + num + ".jpg"
        );
        return message.channel.send({
          embed: embed,
        });
      }
      
      if (args[0].toLowerCase() == "h" && !args[1]) {
        let num = Math.floor(Math.random() * 757 + 1);
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/hentai/" + num + ".jpg"
        );
        return message.channel.send({
          embed: embed,
        });
      }
      if (args[1].match(/^[0-9]+$/) != null) {
        let num = args[1];
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/hentai/" + num + ".jpg"
        );
        return message.channel.send({
          embed: embed,
        });
      }
      
    } else {
      message.reply("( ͡° ͜ʖ ͡°)");
    }
  },
};
