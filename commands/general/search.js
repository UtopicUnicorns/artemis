//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "search",
  description: "[general] Search the internet",
  explain: `Using this command allows you to search the internet from a command.
  You can also search an image.
  
  Example usage: \`search Query\`
  Example usage: \`search image Query\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("search");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 7).split(" ");
    //SWITCH
    switch (args[0].toLowerCase()) {
      //Image search
      case "image":
        gis(`${message.content.slice(prefix.length + 13)}`, logResults);

        function logResults(error, results) {
          if (error) {
            console.log(error);
          } else {
            let resultGrab = JSON.stringify(results[0].url, null, "  ");
            let resultGrab2 = resultGrab.replace(/["']/g, "");
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
              .setImage(resultGrab2)
              .setColor("RANDOM");

            //send embed
            message.channel.send({ embed });
          }
        }
        break;

      //Search normally
      default:
        //google start
        search.queue(
          {
            keyword: `${args}`,
            quantity: 5,
          },
          function (data) {
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
            for (let i of data) {
              //define stuff
              let a = i.title.slice(0, 50);
              let b = i.href;
              let c = i.content.slice(0, 150);

              //up counter
              count++;

              //if 5 return
              if (count < 6)
                embed.addField(`\u200b`, `${count}. [${a}](${b})\n${c}...`);
            }

            //send embed
            message.channel.send({ embed });
          }
        );
        break;
    }
  },
};
