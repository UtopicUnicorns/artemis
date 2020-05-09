const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "update",
  description: "[admin] send out update",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("update");
    usage.number++;
    setUsage.run(usage);
    //
    if (message.author.id !== "127708549118689280") return;
    const logslist = db.prepare("SELECT * FROM guildhub").all();
    const logschannels = [];
    for (const data of logslist) {
      logschannels.push(data.logsChannel);
    }
    //sleep
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    //
    for (let i of logschannels) {
      await sleep(10000);
      if (message.client.channels.cache.get(`${i}`)) {
        const updatetext = new Discord.MessageEmbed()
          .setTitle("Update")
          .setDescription(message.author)
          .setURL("https://discord.gg/EVVtPpw")
          .setColor("RANDOM")
          .addField("Update text:\n", message.content.slice(prefix.length + 7))
          .addField("Channel", message.channel, true)
          .setFooter("Message ID: " + message.id)
          .setTimestamp();
        message.client.channels.cache.get(`${i}`).send({
          embed: updatetext,
        });
      }
    }
  },
};
