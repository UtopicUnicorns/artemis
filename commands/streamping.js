//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "streamping",
  description: `[stream][mod] Turn on or off stream notification @here pings!`,
  explain: `This command shows you if you have @here pings enabled for the stream notifications.\n
  Use the artemis website to turn it off or on.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("streamping");
    usage.number++;
    setUsage.run(usage);

    //pull data
    let streamnotif = getGuild.get(message.guild.id);

    //form status
    if (streamnotif.streamHere == `2`) {
      var optstatus = `Your streamchannel notifications pings are ON!`;
    } else {
      var optstatus = `Your streamchannel notifications pings are OFF!`;
    }

    //form embed
    const embed = new Discord.MessageEmbed()
      .setTitle("Stream Notification pings")
      .setDescription("change this on https://artemisbot.eu/")
      .setColor("RANDOM")
      .addField("Stream Notification pings: ", optstatus);

    //send embed
    message.channel.send({
      embed,
    });
  },
};
