//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `server`,
  name: "command",
  description: `[server] Turn command usage for channels on or off!`,
  explain: `This command will allow mods to disable any and all command usage for specified channels.
  Users with at least kick permissions will surpass this filter.
  
  Example usage: \`command disable\`
  
  Example usage: \`command enable\``,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply("You do not have permissions to use this command!");

    //update usage
    usage = getUsage.get("command");
    usage.number++;
    setUsage.run(usage);

    //define args
    const args = message.content.slice(prefix.length + 8).split(" ");

    //if enable or disable
    switch (args[0].toLowerCase()) {
      case "enable":
        //check if channel exists
        let controller1 = getCC.get(message.channel.id);

        //if channel exists
        if (controller1) {
          //delete entry
          db.prepare(
            `DELETE FROM commandcontrol WHERE channelid = ${message.channel.id}`
          ).run();

          //reply
          return message.reply("Users now can use commands in this channel!");
        } else
          return message.reply("Commands are already enabled in this channel.");
        break;

      case "disable":
        //check if channel exists
        let controller2 = getCC.get(message.channel.id);

        //if it does not exist create it
        if (!controller2) {
          //define
          controlSet = {
            channelid: message.channel.id,
            status: "disable",
          };

          //run database
          setCC.run(controlSet);

          //reply
          return message.reply(
            "Users in this channel cannot use command anymore unless they are at least mods."
          );
        } else
          return message.reply(
            "Commands are already disabled in this channel."
          );
        break;

      default:
        return message.reply(
          "Please tell me if you want to enable commands or disable them for users in this channel."
        );
        break;
    }
  },
};
