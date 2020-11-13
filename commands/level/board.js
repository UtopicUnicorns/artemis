//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `level`,
  name: "board",
  description: "[level] Show leaderboard",
  explain: `This command will show the leader board regarding points and levels.
It also holds a small competative rank vs other servers with Artemis.

Example usage: \`!board\``,
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
        //if message.includes
        if (message.content.toLowerCase().includes("all")) {
          //select guilds
          let guildSelect = db
            .prepare("SELECT DISTINCT guild from scores")
            .all();

          //array to fill
          let pointArray = [];

          //loop trough guild select
          for (let i of guildSelect) {
            //fetch current guild
            let guildSelect2 = db
              .prepare("SELECT * FROM scores WHERE guild = ?;")
              .all(i.guild);

            //empty point
            let pointCount = 0;

            //loop trough current guild
            for (let a of guildSelect2) {
              //add the points
              pointCount = pointCount + a.points;
            }

            //form json obj
            let obj = {
              guild: i.guild,
              total: pointCount,
            };

            //push json
            pointArray.push(obj);
          }

          //sort by points
          pointArray.sort(function (b, a) {
            return a.total - b.total;
          });

          //leaderboard count
          let finalCount = 0;

          //Final string to call
          let finalString = "";

          //Final output
          for (let i of pointArray) {
            //increase counter
            finalCount++;

            //if guild is current guild
            if (i.guild == message.guild.id)
              finalString += `Guild ranking position: Rank ${finalCount}, Total guild cash: ${i.total.toLocaleString()}`;
          }

          //pull data from database
          const top10 = db
            .prepare(
              "SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;"
            )
            .all(message.guild.id);

          //small counter
          let counter = 0;

          //build embed
          const embed = new Discord.MessageEmbed()
            .setTitle("Leaderboard")
            .setDescription(
              `Full leaderboard on https://artemis.rest/${message.guild.id}`
            )
            .setColor("RANDOM");

          //loop trough data
          for (const data of top10) {
            //only do stuff if member exists
            if (counter <= 9) {
              counter++;
              let user = message.guild.members.cache.get(data.user);
              if (user) {
                embed.addField(
                  "Place: (" + counter + ")",
                  `${user.user} \ ${user.user.username}` +
                    "\n" +
                    data.points.toLocaleString() +
                    " points (level " +
                    data.level +
                    ")"
                );
              } else {
                embed.addField(
                  "Place: (" + counter + ")",
                  `${data.user}` +
                    "\n" +
                    data.points.toLocaleString() +
                    " points (level " +
                    data.level +
                    ")"
                );
              }
            }
          }
          embed.addField("rank:", finalString);

          //send embed
          return message.channel.send({
            embed,
          });
        }

        //select guilds
        let guildSelect = db.prepare("SELECT DISTINCT guild from scores").all();

        //array to fill
        let pointArray = [];

        //loop trough guild select
        for (let i of guildSelect) {
          //fetch current guild
          let guildSelect2 = db
            .prepare("SELECT * FROM scores WHERE guild = ?;")
            .all(i.guild);

          //empty point
          let pointCount = 0;

          //loop trough current guild
          for (let a of guildSelect2) {
            //add the points
            pointCount = pointCount + a.points;
          }

          //form json obj
          let obj = {
            guild: i.guild,
            total: pointCount,
          };

          //push json
          pointArray.push(obj);
        }

        //sort by points
        pointArray.sort(function (b, a) {
          return a.total - b.total;
        });

        //leaderboard count
        let finalCount = 0;

        //Final string to call
        let finalString = "";

        //Final output
        for (let i of pointArray) {
          //increase counter
          finalCount++;

          //if guild is current guild
          if (i.guild == message.guild.id)
            finalString += `Guild ranking position: Rank ${finalCount}, Total guild cash: \u058F ${i.total.toLocaleString()}`;
        }

        //pull data from database
        const top10 = db
          .prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;")
          .all(message.guild.id);

        //small counter
        let counter = 0;

        //build embed
        const embed = new Discord.MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription(
            `Full leaderboard on https://artemis.rest/${message.guild.id}`
          )
          .setColor("RANDOM");

        //loop trough data
        for (const data of top10) {
          //only do stuff if member exists
          if (message.guild.members.cache.get(data.user) && counter <= 9) {
            counter++;
            let user = message.guild.members.cache.get(data.user);
            embed.addField(
              "Place: (" + counter + ")",
              `${user.user} \ ${user.user.username}` +
                "\n\u058F " +
                data.points.toLocaleString() +
                " (level " +
                data.level +
                ")"
            );
          }
        }
        embed.addField("rank:", finalString);

        //send embed
        message.channel.send({
          embed,
        });
      }
    }
  },
};
