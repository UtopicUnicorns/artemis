const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "search",
  description: "[general] Search the internet",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("search");
    usage.number++;
    setUsage.run(usage);
    //

    let args = message.content.slice(prefix.length + 7);
    const options = {
      lang: "en",
    };
    googleIt({ options, query: args, disableConsole: true })
      .then((results) => {
        let embed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL())
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
        message.channel.send({
          embed,
        });
      })
      .catch((e) => {
        message.reply("No results, or an error occured.");
      });

    //
  },
};
