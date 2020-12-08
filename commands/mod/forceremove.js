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
  explain: `This is a dangerous command, for it allows you to remove a user's data from the database as long as the user is within your guild.
This means that all user records such as warnings, last warning message, user level, user points, and if the user is muted will be removed.

Example usage: \`!forceremove userID\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `BAN_MEMBERS` permission."
      );

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
