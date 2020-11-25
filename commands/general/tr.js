//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "tr",
  description: "[general] Translate a sentence",
  explain: `Simple translation to english from any language

Example usage: \`!tr hallo daar\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("tr");
    usage.number++;
    setUsage.run(usage);

    //define text
    let text = message.content.slice(prefix.length + 3);

    //actual translation
    translate(text, {
      to: "en",
    }).then((res) => {
      //send translation
      try {
        //form embed
        const translationtext = new Discord.MessageEmbed()
          .setAuthor(
            message.author.username,
            message.author.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setColor("RANDOM")
          .setDescription(res)
          .setTimestamp();

        //send embed
        message.channel.send({
          embed: translationtext,
        });
      } catch (error) {
        console.log(
          `${moment().format("MMMM Do YYYY, HH:mm:ss")}\n${__filename}: ${ln()}`
        );
      }
    });
  },
};
