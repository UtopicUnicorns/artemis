//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "emoji",
  description: "[fun] Show an emoji",
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("emoji");
    usage.number++;
    setUsage.run(usage);

    //build args
    let args = message.content.slice(prefix.length + 6).split(" ");

    //if no args
    if (!args[0]) {
      return message.reply("Provide a custom Emoji!");
    }

    //build x
    let x = args[0];

    //Split by :
    let y = x.split(":");

    //replace last character with nothing
    let EId = y[2].replace(">", "");

    //start request
    request(
      "https://cdn.discordapp.com/emojis/" + EID + ".gif",
      {
        json: true,
      },
      (err, res, body) => {
        if (res) {
          //if valid response for gif
          if (res.statusCode == "200") {
            //define EXt
            var EXt = ".gif";

            //make embed
            const embed = new Discord.MessageEmbed().setImage(
              "https://cdn.discordapp.com/emojis/" + EId + EXt
            );

            //send embed
            message.channel.send({
              embed: embed,
            });
          } else {
            //define EXt
            var EXt = ".png";

            //build embed
            const embed = new Discord.MessageEmbed().setImage(
              "https://cdn.discordapp.com/emojis/" + EId + EXt
            );

            //send embed
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
