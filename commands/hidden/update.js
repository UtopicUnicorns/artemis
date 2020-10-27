//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `hidden`,
  name: "update",
  description: "[hidden] send out update",
  explain: `This will send an update message of your choosing to every logs channel linked to Artemis.`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You do not have permissions to use this command!");

    //update usage
    usage = getUsage.get("update");
    usage.number++;
    setUsage.run(usage);

    //if not me
    if (message.author.id !== "127708549118689280") return;

    //pull data
    const logslist = db.prepare("SELECT * FROM guildhub").all();

    //empy array
    const logschannels = [];

    //loop trough list
    for (const data of logslist) {
      //push data
      logschannels.push(data.logsChannel);
    }

    //sleep
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    //for each log channel
    for (let i of logschannels) {
      //sleep
      await sleep(5000);

      //if channel exists
      if (message.client.channels.cache.get(`${i}`)) {
        //form embed
        const updatetext = new Discord.MessageEmbed()
          .setTitle("Update")
          .setDescription(message.author)
          .setURL("https://discord.gg/EVVtPpw")
          .setColor("RANDOM")
          .addField("Update text:\n", message.content.slice(prefix.length + 7))
          .addField("Channel", message.channel, true)
          .setFooter("Message ID: " + message.id)
          .setTimestamp();

        //send embed
        message.client.channels.cache.get(`${i}`).send({
          embed: updatetext,
        });
      }
    }
  },
};
