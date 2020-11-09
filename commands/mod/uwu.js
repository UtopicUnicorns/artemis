//start modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "uwu",
  description: "[mod] Cursed command",
  explain: `This command makes use of existing webhooks, if there is no webhook in the channel you have set this up, Artemis will create one if possible.
This command will convert all messages sent within the server it has been setup in to be converted to \`uwu\` speech.
It's a horrible thing, but people love it.

Example usage: \`!uwu\``,
  execute(message) {
    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage
    usage = getUsage.get("uwu");
    usage.number++;
    setUsage.run(usage);

    //reject non mods after this point
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply("You do not have permissions to use this command!");

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
