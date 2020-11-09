//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "wallpaper",
  description: "[fun] Random wallpaper",
  explain: `A small collection of single and double screen wallpapers.
The command will return a random wallpaper.

Example usage: \`!wallpaper s\` _Single screen wallpaper_

Example usage: \`!wallpaper d\` _Double screen wallpaper_`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("wallpaper");
    usage.number++;
    setUsage.run(usage);

    //form args
    const args = message.content.slice(prefix.length + 10).split(" ");

    //single
    if (args[0] == "s") {
      //pull pics
      const photos = fs.readdirSync("./pics/wallpaper/single");

      //empty array
      const array = [];

      //loop trough pics
      for (const file of photos) {
        //push pic into array
        array.push(file);
      }

      //form embed
      const embed = new Discord.MessageEmbed().setImage(
        "attachment://image.png"
      );

      //send embed
      return message.channel.send({
        embed: embed,
        files: [
          {
            attachment:
              "./pics/wallpaper/single/" +
              array[~~(Math.random() * array.length)],
            name: "image.png",
          },
        ],
      });
    }

    //double
    if (args[0] == "d") {
      //pull pics
      const photos = fs.readdirSync("./pics/wallpaper/double");

      //empty array
      const array = [];

      //loop trough pics
      for (const file of photos) {
        //push pic into array
        array.push(file);
      }

      //form embed
      const embed = new Discord.MessageEmbed().setImage(
        "attachment://image.png"
      );

      //send embed
      return message.channel.send({
        embed: embed,
        files: [
          {
            attachment:
              "./pics/wallpaper/double/" +
              array[~~(Math.random() * array.length)],
            name: "image.png",
          },
        ],
      });
    }

    //if no args
    return message.reply(
      "`Usage:\n" + prefix + "wallpaper s\n" + prefix + "wallpaper d`"
    );
    //end
  },
};
