//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "channelmanage",
  description: "[server] Show preset channels",
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("channelmanage");
    usage.number++;
    setUsage.run(usage);

    //define guild data
    let channelget = getGuild.get(message.guild.id);

    //build embed
    const hellothereguilde = new Discord.MessageEmbed()
      .setTitle("Manage Channels")
      .setColor("RANDOM")
      .setDescription("edit the channels on https://artemisbot.eu/")
      .addField(
        "General Channel: ",
        message.guild.channels.cache.find(
          (channel) => channel.id === channelget.generalChannel
        )
      )
      .addField(
        "Mute Channel: ",
        message.guild.channels.cache.find(
          (channel) => channel.id === channelget.muteChannel
        )
      )
      .addField(
        "Logs Channel: ",
        message.guild.channels.cache.find(
          (channel) => channel.id === channelget.logsChannel
        )
      )
      .addField(
        "Highlight Channel: ",
        message.guild.channels.cache.find(
          (channel) => channel.id === channelget.highlightChannel
        )
      )
      .addField(
        "Reaction Roles Channel: ",
        message.guild.channels.cache.find(
          (channel) => channel.id === channelget.reactionChannel
        )
      )
      .addField(
        "Stream Notification Channel: ",
        message.guild.channels.cache.find(
          (channel) => channel.id === channelget.streamChannel
        )
      )
      .setTimestamp();

    //send embed
    return message.channel.send({
      embed: hellothereguilde,
    });
  },
};
