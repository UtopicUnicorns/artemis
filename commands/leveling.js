//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "leveling",
  description: `[mscore] Turn on or off leveling for your server!`,
  explain: `This command will allow you to turn off or on point/level gaining for your server.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("leveling");
    usage.number++;
    setUsage.run(usage);

    //form args
    const args = message.content.slice(prefix.length + 9).split(" ");

    //if on
    if (args[0] == `on`) {
      //pull from database
      let levelthing = getGuild.get(message.guild.id);

      //if leveling is on or off
      if (levelthing.leveling != `1`) {
        levelthing.leveling = `1`;
        setGuild.run(levelthing);
        return message.reply("You turned on leveling for your server!");
      } else {
        return message.reply("Leveling already enabled!");
      }
    }

    //if off
    if (args[0] == `off`) {
      //pull from database
      let levelthing = getGuild.get(message.guild.id);

      //if leveling is on or off
      if (levelthing.leveling != `2`) {
        levelthing.leveling = `2`;
        setGuild.run(levelthing);
        return message.reply("You turned off leveling for your server!");
      } else {
        return message.reply("Leveling already disabled");
      }
    }

    //if no args or wrong args
    //pull from database
    let levelthing = getGuild.get(message.guild.id);

    //if leveling is on or off
    if (levelthing.leveling == `2`) {
      var optstatus = `Leveling for your server is OFF!`;
    } else {
      var optstatus = `Leveling for your server is ON!`;
    }
    message.reply(prefix + "leveling on/off\n" + optstatus);
  },
};
