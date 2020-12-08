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
  explain: `Within the Artemis Bot Network are many servers which cover related topics (in Artemis's case, it's space related and Linux related).
Related servers often attract users from the same pool, userdata simply tells you if a user has been misbehaving in other servers. It will not show actual data of the user, only how many times a user has been warned, and if the user has been muted in a server Artemis is also in.

Example usage: \`!userdata userID\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("userdata");
    usage.number++;
    setUsage.run(usage);

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

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
