//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "nick",
  description: "[mod] Change a user nickname",
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user has no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("nick");
    usage.number++;
    setUsage.run(usage);

    //define user
    const user = message.mentions.users.first();

    //if no user
    if (!user) return message.reply("You must mention someone!");

    //define args
    const args = message.content.slice(prefix.length + user.id.length + 10);

    //if no args
    if (!args) return message.reply("You must give a new nickname!");

    //change nickname
    message.guild.members.cache
      .get(user.id)
      .setNickname(args)
      .catch(console.log(""));

    //notify user
    return message.reply(user + " nickname changed to: " + args);
  },
};
