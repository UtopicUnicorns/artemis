//load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start code
module.exports = {
  category: `linux`,
  name: "proton",
  description: "[linux] Search the ProtonDB",
  explain: `This command will search the Proton Database and Steam API for the game you specify.
It will show if a game is native to Linux, or if Proton partially or fully supports it.

Example usage: \`!proton subnautica\``,
  execute(message) {
    //Build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("proton");
    usage.number++;
    setUsage.run(usage);

    //build args
    const args = message.content.slice(prefix.length + 7);

    //if no args
    if (!args) return message.reply("Please provide a game name!");

    //function
    request(
      `https://store.steampowered.com/api/storesearch/?term=${args}&l=english&cc=US`,
      {
        json: true,
      },
      (err, res, body) => {
        //if something went wrong
        if (err) return message.reply("And error occured!");

        //redefine the first entry
        let found = body.items[0];

        //if err
        if (!found) return message.reply("Game not found!");

        //Define stuff
        let gameName = found.name;
        let gameId = found.id;
        let gameThumb = found.tiny_image;
        let gameScore = found.metascore;
        let gameLinux = found.platforms.linux;

        //next request
        request(
          `https://www.protondb.com/api/v1/reports/summaries/${gameId}.json`,
          {
            json: true,
          },
          (err, res, body) => {
            //if something went wrong
            if (err) return message.reply("And error occured!");

            //Embed to send
            const embed = new Discord.MessageEmbed()
              .setTitle(`${gameName} (${gameScore})`)
              .setURL("https://www.protondb.com/app/" + gameId)
              .setThumbnail(gameThumb)
              .setDescription("Native: " + gameLinux)
              .addField("Rating confidence: ", body.confidence)
              .addField("Tier: ", body.tier)
              .addField("Trending Tier: ", body.trendingTier)
              .addField("Best rating given", body.bestReportedTier)
              .addField(
                "Steam Link",
                "https://store.steampowered.com/app/" + gameId
              )
              .addField(
                "ProtonDB Link: ",
                "https://www.protondb.com/app/" + gameId
              )
              .setImage(gameThumb)
              .setColor("#RANDOM");
            message.channel.send({
              embed: embed,
            });
          }
        );
      }
    );
  },
};
