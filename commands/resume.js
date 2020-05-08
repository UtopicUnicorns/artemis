const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "resume",
  description: "[music] Resume the music",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("resume");
    usage.number++;
    setUsage.run(usage);
    //
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    serverQueue.connection.dispatcher.resume();
    return message.reply('Music was resumed!');
  },
};
