const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "vol",
  description: "[music] Control the volume",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("vol");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 4).split(" ");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    if (!args[0]) {
      return message.reply("Provide a percentage between 1 and 100\nCurrent Volume: " + serverQueue.volume);
    }
    if (args[0] >= 1 && args[0] <= 100) {
      serverQueue.connection.dispatcher.setVolume(args[0] / 100);
      serverQueue.volume = args[0];
      return message.reply("Set volume to " + args[0] + "%");
    }
    if (args[0] == "reset") {
      serverQueue.connection.dispatcher.setVolume(10 / 100);
      serverQueue.volume = 10;
      return message.reply("Set volume to 10%");
    }
  },
};
