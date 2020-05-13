const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "wallpaper",
  description: "[fun] Random wallpaper",
  execute(message) {
    //form prefix
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //usage count
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("wallpaper");
    usage.number++;
    setUsage.run(usage);

    //form args
    const args = message.content.slice(prefix.length + 10).split(" ");

    //single
    if (args[0] == "s") {
      const photos = fs.readdirSync("./pics/wallpaper/single");
      const array = [];
      for (const file of photos) {
        array.push(file);
      }
      const embed = new Discord.MessageEmbed().setImage(
        "attachment://image.png"
      );
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
      const photos = fs.readdirSync("./pics/wallpaper/double");
      const array = [];
      for (const file of photos) {
        array.push(file);
      }
      const embed = new Discord.MessageEmbed().setImage(
        "attachment://image.png"
      );
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
