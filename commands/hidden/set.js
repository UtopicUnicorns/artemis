//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `hidden`,
  name: "set",
  description: "[hidden] Set the sentient channel",
  explain: `This command allows you to set the artemis talks channel, use either channel ID or channel mention.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You do not have permissions to use this command!");
    if (message.channel.id !== "642882039372185609") return;

    //update usage
    usage = getUsage.get("set");
    usage.number++;
    setUsage.run(usage);

    //define args
    let args = message.content
      .slice(prefix.length + 4)
      .replace("<", "")
      .replace("#", "")
      .replace(">", "")
      .split(" ");

    //if not a channel
    if (!message.client.channels.cache.get(`${args[0]}`))
      return message.reply("Invalid channel!");

    //check if channel exists
    let channelcheck = message.client.channels.cache.get(`${args[0]}`);

    //Write channelID to file
    fs.writeFile("./channelset.txt", args[0], function (err) {
      if (err) throw err;
    });

    //change channel topic to channel name and guild name
    channelcheck.setTopic(`#${channelcheck.name}`);

    //notify user
    return message.reply(`Channel changed to ${channelcheck}`);
  },
};
