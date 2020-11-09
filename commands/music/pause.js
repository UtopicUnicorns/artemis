//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `music`,
  name: "pause",
  description: "[music] Pause the music",
  explain: `Pauses the music player.

Example usage: \`!pause\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("pause");
    usage.number++;
    setUsage.run(usage);

    //define server queue
    const serverQueue = message.client.queue.get(message.guild.id);

    //if no queue
    if (!serverQueue) return message.channel.send("There is nothing playing.");

    //pause player
    serverQueue.connection.dispatcher.pause(true);

    //send notify
    return message.reply("Music was paused!");
  },
};
