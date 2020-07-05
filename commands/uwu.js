//start modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "uwu",
  description: "[mod] Cursed command",
  explain: `Cursed command!`,
  execute(message) {
    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage
    usage = getUsage.get("uwu");
    usage.number++;
    setUsage.run(usage);

    //reject non mods after this point
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //add or delete support channel
    let uwuCheck = getUwu.get(message.channel.id, message.guild.id);
    if (!uwuCheck) {
      uwuCheck = {
        cid: message.channel.id,
        gid: message.guild.id,
      };
      setUwu.run(uwuCheck);
      return message.reply(`Added: ${message.channel} to the UWU list!`);
    } else {
      db.prepare(
        `DELETE FROM uwu WHERE cid = '${message.channel.id}' AND gid = '${message.guild.id}'`
      ).run();
      return message.reply(`Removed: ${message.channel} from the UWU list!`);
    }

    //next
  },
};
