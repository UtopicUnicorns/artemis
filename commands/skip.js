//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "skip",
  description: "[music] Skip a song!",
  explain: `When the bot is playing music you will have the option to skip songs.\n
  When using plain \`skip\` or \`skip 0\` then the current song playing will be skipped.\n
  using \`skip 3\` will skip the 3rd song in the playlist, you can see the playlist with the command \`np\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("skip");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 5).split(" ");

    //form server queue
    const serverQueue = message.client.queue.get(message.guild.id);

    //if not in a vc
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );

    //if no queue
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");

    //if no args
    if (!args[0]) {
      //skip
      serverQueue.connection.dispatcher.end();

      //notify
      return message.reply("Skipped!");
    }

    //if 0
    if (args[0] == "0") {
      //skip
      serverQueue.connection.dispatcher.end();

      //notify
      return message.reply("Skipped!");
    }

    //other args
    if (args[0] > serverQueue.songs.length - 1) {
      //error
      return message.reply("Invalid song number!");
    } else {
      //delete from queue
      serverQueue.songs.splice(args[0], 1);

      //notify
      return message.reply("skipped!");
    }
  },
};
