//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//set
let ping = new Set();

//start
module.exports = {
  category: `fun`,
  name: "p",
  description: "[fun] Ping a website",
  explain: `This will fully load a webpage within the bot's code, then return the loading speed to the user.

Example usage: \`!p https://artemis.rest\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("p");
    usage.number++;
    setUsage.run(usage);

    //if not double post
    if (!ping.has(message.guild.id)) {
      //add to set
      ping.add(message.guild.id);

      //http or https
      if (
        message.content.includes("http://") ||
        message.content.includes("https://")
      ) {
        var args = message.content.slice(prefix.length + 2);
      } else {
        var args = "https://" + message.content.slice(prefix.length + 2);
      }

      //define time
      var time1 = Date.now();

      //start request
      request(
        args,
        {
          json: true,
        },
        (err, res, body) => {
          //define time
          var time2 = Date.now();

          //calc ping
          var calctime = time2 - time1;

          //define res code
          if (res) {
            var status = res.statusCode;
          } else {
            var status = "Website not found!";
          }

          //form embed
          const embed = new Discord.MessageEmbed()
            .setTitle(args)
            .setDescription(
              "Status code: " + status + "\nPage loaded in: " + calctime + " ms"
            );

          //send embed
          message.channel.send({
            embed: embed,
          });
        }
      );
      //remove from set
      setTimeout(() => {
        ping.delete(message.guild.id);
      }, 1000);
    }
  },
};
