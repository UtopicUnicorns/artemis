//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "lenny",
  description: "[fun] ( ͡° ͜ʖ ͡°)",
  explain: `Yeah... let's not explain this.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("lenny");
    usage.number++;
    setUsage.run(usage);

    //if proper channels
    if (
      message.channel.id === "692762201991282778" ||
      message.channel.id === "702267558195232868" ||
      message.channel.id === "729049434276757545"
    ) {
      //define args
      let args = message.content.slice(prefix.length + 6).split(" ");

      //if no args
      if (!args[0]) {
        //random number
        let num = Math.floor(Math.random() * 1424 + 1);

        //build embed
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/ecchi/" + num + ".jpg"
        );

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
      if (args[0].match(/^[0-9]+$/) != null) {
        //define number
        let num = args[0];

        //build embed
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/ecchi/" + num + ".jpg"
        );

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }

      if (args[0].toLowerCase() == "h" && !args[1]) {
        //define number
        let num = Math.floor(Math.random() * 757 + 1);

        //build embed
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/hentai/" + num + ".jpg"
        );

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
      if (args[1].match(/^[0-9]+$/) != null) {
        //define number
        let num = args[1];

        //build embed
        const embed = new Discord.MessageEmbed().setImage(
          "https://aranym.com/hentai/" + num + ".jpg"
        );

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
    } else {
      //if no proper channel
      message.reply("( ͡° ͜ʖ ͡°)");
    }
  },
};
