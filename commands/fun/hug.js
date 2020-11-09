//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "hug",
  description: "[fun] Hug someone",
  explain: `This will display an image as if hugging the specified user.

Example usage: \`!hug @mention\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("hug");
    usage.number++;
    setUsage.run(usage);

    //define user
    let user = message.mentions.users.first();

    //if no user
    if (!user) return;

    //random gifs
    let selectthis = [
      "https://media.giphy.com/media/HZzrAS6wkvcVW/giphy.gif",
      "https://media1.tenor.com/images/94989f6312726739893d41231942bb1b/tenor.gif",
      "https://media1.tenor.com/images/4d89d7f963b41a416ec8a55230dab31b/tenor.gif",
      "https://media1.tenor.com/images/f5df55943b64922b6b16aa63d43243a6/tenor.gif",
      "https://media1.tenor.com/images/684efd91473dcfab34cb78bf16d211cf/tenor.gif",
    ];

    //select random gif
    let hugsel = selectthis[~~(Math.random() * selectthis.length)];

    //form embed
    const embed = new Discord.MessageEmbed()
      .setTitle(message.author.username + " hugs " + user.username)
      .setImage(hugsel);

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
