//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "ping",
  description: "[general] ping",
  explain: `This is just a ping command, checks the lag between messages...

Example usage: \`!ping\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("ping");
    usage.number++;
    setUsage.run(usage);

    //ping
    const m = await message.channel
      .send("Ping?")
      .catch((err) => console.log(""));

    if (!m) return;
    m.edit(
      `Pong! Latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. API Latency is ${Math.round(message.client.ws.ping)}ms`
    ).catch((err) => console.log(""));
  },
};
