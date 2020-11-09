//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `music`,
  name: "np",
  description: "[music] Shows the queue list",
  explain: `Shows the queue if there is music playing.

Example usage: \`!np\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("np");
    usage.number++;
    setUsage.run(usage);

    //define serverqueue
    const serverQueue = message.client.queue.get(message.guild.id);

    //if no queue
    if (!serverQueue) return message.channel.send("There is nothing playing.");

    //empty array
    let array = [];

    //counter
    let count = "0";

    //push into array and update count
    serverQueue.songs.map(
      (song) =>
        count++ && array.push("(" + Math.floor(count - 1) + ") " + song.title)
    );

    //build embed
    const rembed = new Discord.MessageEmbed()
      .setTitle("Now playing:" + serverQueue.songs[0].title)
      .setAuthor(
        message.author.username,
        message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setThumbnail(serverQueue.songs[0].thumb)
      .setColor("RANDOM")
      .setDescription("Queue below:\n" + array.join("\n"))
      .setFooter(
        "You can skip songs by using the matching song number:\n" +
          prefix +
          "skip 4"
      );

    //send embed
    message.channel.send(rembed);
  },
};
