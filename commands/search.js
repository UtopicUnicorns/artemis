//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "search",
  description: "[general] Search the internet",
  explain: `Using this command allows you to search the internet from a command.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("search");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 7);

    //options
    const options = {
      lang: "en",
    };

    //google start
    googleIt({ options, query: args, disableConsole: true })
      .then((results) => {
        //form embed
        let embed = new Discord.MessageEmbed()
          .setAuthor(
            message.author.username,
            message.author.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setTitle(results[0].title)
          .setURL(results[0].link)
          .setDescription(results[0].snippet + "\n\n" + results[0].link)
          .setColor("RANDOM")
          .setFooter(
            results[1].snippet +
              "\n" +
              results[1].link +
              "\n\n" +
              results[2].snippet +
              "\n" +
              results[2].link
          );

        //send embed
        message.channel.send({
          embed,
        });
      })
      .catch((e) => {
        message.reply("No results, or an error occured.");
      });
  },
};
