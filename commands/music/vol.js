//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `music`,
  name: "vol",
  description: "[music] Control the volume",
  explain: `This will change the volume of the music player from 1-100

Example usage: \`!vol NUM\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("vol");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 4).split(" ");

    //form queue
    const serverQueue = message.client.queue.get(message.guild.id);

    //if no queue
    if (!serverQueue) return message.channel.send("There is nothing playing.");

    //if no args
    if (!args[0]) {
      return message.reply(
        "Provide a percentage between 1 and 100\nCurrent Volume: " +
          serverQueue.volume
      );
    }

    //if args is above and below 100
    if (args[0] >= 1 && args[0] <= 100) {
      //set volume
      serverQueue.connection.dispatcher.setVolume(args[0] / 100);

      //set volume
      serverQueue.volume = args[0] / 5;

      //notify
      return message.reply("Set volume to " + args[0] + "%");
    }

    //reset
    if (args[0] == "reset") {
      //reset volume
      serverQueue.connection.dispatcher.setVolume(5 / 5);

      //reset volume
      serverQueue.volume = 2;

      //notify
      return message.reply("Set volume to 10%");
    }
  },
};
