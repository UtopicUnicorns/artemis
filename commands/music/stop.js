//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `music`,
  name: "stop",
  description: "[music] Stop all songs in the queue!",
  explain: `This will stop the music player.

Example usage: \`!stop\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("stop");
    usage.number++;
    setUsage.run(usage);

    //form queue
    const serverQueue = message.client.queue.get(message.guild.id);

    //if not in vc
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );

    //delete songs
    serverQueue.songs = [];

    //end player
    serverQueue.connection.dispatcher.end();
  },
};
