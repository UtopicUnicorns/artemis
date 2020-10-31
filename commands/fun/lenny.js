//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "lenny",
  description: "[fun] ( ͡° ͜ʖ ͡°)",
  explain: `( ͡° ͜ʖ ͡°)`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("lenny");
    usage.number++;
    setUsage.run(usage);

    //yes
    return message.reply("( ͡° ͜ʖ ͡°)");
  },
};
