const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "board",
  description: "[level] Show leaderboard",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    let guildChannels2 = getGuild.get(message.guild.id);
    if (guildChannels2) {
      if (guildChannels2.leveling == "2") {
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );
      } else {
        const top10 = db
          .prepare(
            "SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;"
          )
          .all(message.guild.id);
        let counter = 0;
        const embed = new Discord.MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription("Full leaderboard on https://artemisbot.eu/")
          .setColor("RANDOM");
        for (const data of top10) {
          if (message.guild.members.cache.get(data.user)) {
            counter++;
            let user = message.guild.members.cache.get(data.user);
            embed.addField(
              "Place: (" + counter + ")",
              user.user +
                "\n" +
                data.points +
                " points (level " +
                data.level +
                ")"
            );
          }
        }
        message.channel.send({
          embed,
        });
      }
    }
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("board");
    usage.number++;
    setUsage.run(usage);
    //
  },
};
