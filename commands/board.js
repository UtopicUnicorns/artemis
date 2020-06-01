//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "board",
  description: "[level] Show leaderboard",
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("board");
    usage.number++;
    setUsage.run(usage);

    //define guildchannels
    let guildChannels2 = getGuild.get(message.guild.id);

    //if exists
    if (guildChannels2) {
      //if leveling for the guild is off
      if (guildChannels2.leveling == "2") {
        //little joke reply
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );

        //if leveling is on for guild
      } else {
        //pull data from database
        const top10 = db
          .prepare(
            "SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;"
          )
          .all(message.guild.id);

        //small counter
        let counter = 0;

        //build embed
        const embed = new Discord.MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription("Full leaderboard on https://artemisbot.eu/")
          .setColor("RANDOM");

        //loop trough data
        for (const data of top10) {
          //only do stuff if member exists
          if (message.guild.members.cache.get(data.user)) {
            counter++;
            let user = message.guild.members.cache.get(data.user);
            embed.addField(
              "Place: (" + counter + ")",
              `${user.user} \ ${user.user.username}` +
                "\n" +
                data.points +
                " points (level " +
                data.level +
                ")"
            );
          }
        }

        //send embed
        message.channel.send({
          embed,
        });
      }
    }
  },
};
