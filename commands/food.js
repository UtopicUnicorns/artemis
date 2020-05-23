//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "food",
  description: "[fun] Random food picture",
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("food");
    usage.number++;
    setUsage.run(usage);

    //def pics
    const photos = fs.readdirSync("./pics/food");

    //empty arrat
    const array = [];

    //loop trough photos
    for (const file of photos) {
      //push into array
      array.push(file);
    }

    //build embed
    const embed = new Discord.MessageEmbed().setImage("attachment://image.png");

    //send embed
    message.channel.send({
      embed: embed,
      files: [
        {
          attachment: "./pics/food/" + array[~~(Math.random() * array.length)],
          name: "image.png",
        },
      ],
    });
  },
};
