//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "cat",
  description: "[fun] Random cat picture",
  explain: `This command will show a random cat picture.
These cats are my own.

Example usage: \`!cat\``,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("cat");
    usage.number++;
    setUsage.run(usage);

    //define pics
    const photos = fs.readdirSync("./pics/cats");

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
          attachment: "./pics/cats/" + array[~~(Math.random() * array.length)],
          name: "image.png",
        },
      ],
    });
  },
};
