const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "skip",
  description: "[music] Skip a song!",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("skip");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 5).split(" ");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    if (!args[0]) {
      serverQueue.connection.dispatcher.end();
      return message.reply("Skipped!");
    }
    if (args[0] == "0") {
      serverQueue.connection.dispatcher.end();
      return message.reply("Skipped!");
    }
    if (args[0] > serverQueue.songs.length - 1) {
      return message.reply("Invalid song number!");
    } else {
      serverQueue.songs.splice(args[0], 1);
      return message.reply("skipped!");
    }
  },
};
