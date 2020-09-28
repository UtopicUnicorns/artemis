//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "forceremove",
  description: "[mod] remove a database entry",
  explain: `Removes every trace of the mentioned userID from the database.\n
  This will also completely wipe any userinfo, warnings, mutes and personal user settings.`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user has no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("forceremove");
    usage.number++;
    setUsage.run(usage);

    //build args
    let args = message.content.slice(prefix.length + 12);

    //if no args
    if (!args) return message.reply(prefix + "forceremove userID");

    //delete user from database
    db.prepare(
      `DELETE FROM scores WHERE user = ${args} AND guild = ${message.guild.id}`
    ).run();

    //notify user
    message.reply("Deleted database entry for: " + args);
  },
};
