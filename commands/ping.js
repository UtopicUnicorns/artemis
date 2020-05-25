//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "ping",
  description: "[general] ping",
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("ping");
    usage.number++;
    setUsage.run(usage);

    //ping
    if (message.author.id == "558206606685372451") {
      const m = await message.channel.send("Wanna dance?");
      m.edit(
        `Let's dance! \uD83D\uDC83\uD83C\uDFFB\uD83D\uDC83\uD83C\uDFFB\uD83D\uDC83\uD83C\uDFFB\uD83D\uDC83\uD83C\uDFFB\n Latency is ${
          m.createdTimestamp - message.createdTimestamp
        }ms. API Latency is ${Math.round(message.client.ws.ping)}ms`
      );
    } else {
      const m = await message.channel.send("Ping?");
      m.edit(
        `Pong! Latency is ${
          m.createdTimestamp - message.createdTimestamp
        }ms. API Latency is ${Math.round(message.client.ws.ping)}ms`
      );
    }
  },
};
