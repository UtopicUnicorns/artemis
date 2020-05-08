const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "emoji",
  description: "[fun] Show an emoji",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("emoji");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 6).split(" ");
    if (!args[0]) {
      return message.reply("Provide a custom Emoji!");
    }
    let x = args[0];
    let y = x.split(":");
    let EID = y[2].replace(">", "");
    request(
      "https://cdn.discordapp.com/emojis/" + EID + ".gif",
      {
        json: true,
      },
      (err, res, body) => {
        if (res) {
          if (res.statusCode == "200") {
            var EXT = ".gif";
            const embed = new Discord.MessageEmbed().setImage(
              "https://cdn.discordapp.com/emojis/" + EID + EXT
            );
            message.channel.send({
              embed: embed,
            });
          } else {
            var EXT = ".png";
            const embed = new Discord.MessageEmbed().setImage(
              "https://cdn.discordapp.com/emojis/" + EID + EXT
            );
            message.channel.send({
              embed: embed,
            });
          }
        } else {
          return message.reply("Invalid Emoji!");
        }
      }
    );
  },
};
