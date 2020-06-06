//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "resume",
  description: "[music] Resume the music",
  explain: `If the bot is playing music and the music is currently paused, then this command will unpause it.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("resume");
    usage.number++;
    setUsage.run(usage);

    //form server queue
    const serverQueue = message.client.queue.get(message.guild.id);

    //if no server queue
    if (!serverQueue) return message.channel.send("There is nothing playing.");

    //resume player
    serverQueue.connection.dispatcher.resume();

    //notify
    return message.reply("Music was resumed!");
  },
};
