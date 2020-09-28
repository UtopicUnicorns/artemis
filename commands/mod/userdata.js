//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "userdata",
  description: "[mod] See user info",
  explain: `This command will let you see a users database entries`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("userdata");
    usage.number++;
    setUsage.run(usage);

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //build args
    let args = message.content.slice(prefix.length + 9).split(" ");

    //if no args
    if (!args[0]) return message.reply("Provide an user ID!");

    //pull data
    const getScore2 = db
      .prepare("SELECT * FROM scores WHERE user = ?")
      .all(args[0]);

    //if no info
    if (!getScore2[0]) return message.reply("No info found on this ID!");

    //guild array
    let guildArray = [];

    //warnings
    let warningPoints = 0;

    //mutes
    let mutePoints = 0;

    //loop trough
    for (let i of getScore2) {
      //if guild exists
      if (message.client.guilds.cache.get(i.guild)) {
        guildArray.push(
          message.client.guilds.cache.get(i.guild).name +
            " " +
            message.client.guilds.cache.get(i.guild).id
        );
      } else {
        guildArray.push(i.guild);
      }

      //add warning points
      warningPoints = warningPoints + i.warning;

      //add mutes
      mutePoints = mutePoints + i.muted;
    }

    //form embed
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        message.guild.name,
        message.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(`Info for ${args[0]}`)
      .setColor(`RANDOM`)
      .setThumbnail(
        message.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .addField("Total warnings across servers: ", `${warningPoints}`)
      .addField("Total mutes across servers: ", `${mutePoints}`)
      .addField("Seen in other servers: ", `${guildArray.join("\n")}`);

    //send embed
    return message.channel.send(embed);
  },
};
