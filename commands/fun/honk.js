//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "honk",
  description: "[fun] Random geecko picture",
  explain: `This command will show the user a random geeko picture, honk honk.

Example usage: \`!honk\``,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("honk");
    usage.number++;
    setUsage.run(usage);

    //define pics
    const photos = fs.readdirSync("./pics/honk");

    //empty array
    const array = [];

    //loop trough photos
    for (const file of photos) {
      //push into array
      array.push(file);
    }

    //form embed
    const embed = new Discord.MessageEmbed().setImage("attachment://image.png");

    //send embed
    message.channel.send({
      embed: embed,
      files: [
        {
          attachment: "./pics/honk/" + array[~~(Math.random() * array.length)],
          name: "image.png",
        },
      ],
    });
  },
};
