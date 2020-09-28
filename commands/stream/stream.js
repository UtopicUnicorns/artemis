//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `stream`,
  name: "stream",
  description: `[stream] turn on or off your own stream notifications`,
  explain: `This command shows you if you allow the bot to notify others if you go live on Twitch.\n
  Change this on the artemis website to turn it on or off.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("stream");
    usage.number++;
    setUsage.run(usage);

    //pull data
    let stream = getScore.get(message.author.id, message.guild.id);

    //form status
    if (stream.stream == `2`) {
      var optstatus = `Your stream notifications are OFF!`;
    } else {
      var optstatus = `Your stream notifications are ON!`;
    }

    //form embed
    const embed = new Discord.MessageEmbed()
      .setTitle("Stream Notifications")
      .setDescription("change this on https://artemisbot.eu/")
      .setColor("RANDOM")
      .addField("Stream Notifications: ", optstatus);

    //send embed
    message.channel.send({
      embed,
    });
  },
};
