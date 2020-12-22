//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `hidden`,
  name: "lab",
  description: "[hidden] the lab",
  explain: `UtopicUnicorn's laboratory.`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply("You do not have permissions to use this command!");

    //update usage
    usage = getUsage.get("lab");
    usage.number++;
    setUsage.run(usage);
  },
};
