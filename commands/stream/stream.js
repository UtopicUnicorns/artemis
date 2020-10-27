//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `stream`,
  name: "stream",
  description: `[stream] Manage your guilds streamers!`,
  explain: `Add or remove streamers from your guild streaming list!
  Streamers will be added or removed depending on if the streamer is already in the database for your server.

  Example usage: \`stream {StreamerName}\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("stream");
    usage.number++;
    setUsage.run(usage);

    //Mods required!
    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You do not have permissions to use this command!");

    //args
    let streamerName = message.content.slice(prefix.length + 7);

    //if no args
    if (!streamerName) return message.reply("Please provide a streamers name.");

    //get streamer
    let StreamerCheck = getStreamers.get(`${message.guild.id}-${streamerName}`);

    //perform check
    if (!StreamerCheck) {
      //define new streamer
      streamerAdd = {
        streamerguild: `${message.guild.id}-${streamerName}`,
        streamer: `${streamerName}`,
        guild: `${message.guild.id}`,
        status: `offline`,
      };

      //Run db
      setStreamers.run(streamerAdd);

      //notify
      return message.reply(`Added ${streamerName} to our list!`);
    } else {
      //delete from database
      db.prepare(
        `DELETE FROM streamers WHERE streamerguild = '${message.guild.id}-${streamerName}'`
      ).run();

      //notify
      return message.reply(
        `Removed ${streamerName} from the guild streamers list!`
      );
    }
  },
};
