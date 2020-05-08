const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "pause",
  description: "[music] Pause the music",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("pause");
    usage.number++;
    setUsage.run(usage);
    //
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    serverQueue.connection.dispatcher.pause(true);
    return message.reply('Music was paused!');
  },
};
