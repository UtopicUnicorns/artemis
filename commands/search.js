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

    //google start
    googleIt({ query: args, disableConsole: true }).then((results) => {
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
        .setThumbnail(
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setTitle(`Search results for: ${args.slice(0, 20)}`)
        .setColor("RANDOM");

      //build counter
      let count = 0;

      //loop trough results
      for (let i of results) {
        //define stuff
        let a = i.title;
        let b = i.link;
        let c = i.snippet.slice(0, 150);

        //up counter
        count++;

        //if 5 return
        if (count < 6) embed.addField(`\u200b`, `${count}. [${a}](${b})\n${c}...`);
      }

      //send embed
      message.channel.send({ embed });
    });
  },
};
