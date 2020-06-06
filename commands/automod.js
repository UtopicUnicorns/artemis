//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "automod",
  description: `[server] Turn on or off automod!`,
  explain: `Automod affects how users experience the chat, it actively blocks discord links, 
  blocks certain words if set up, mutes users who mass ping multiple users and stops users from verifying if strict mode is on.\n
  \`automod on\` will enable the automod\n
  \`automod off\` will turn automod off\n
  \`automod strict\` will prevent users from verifying, useful in raids\n`,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("automod");
    usage.number++;
    setUsage.run(usage);

    //define args
    const args = message.content.slice(prefix.length + 8).split(" ");

    //define notification thing
    let automodNotif = getGuild.get(message.guild.id);

    //if args is on
    if (args[0] == `on`) {
      if (automodNotif.autoMod != `2`) {
        //turn automod on
        automodNotif.autoMod = `2`;

        //run database
        setGuild.run(automodNotif);

        //notify user
        return message.reply("AutoMod is turned ON!");
      } else {
        //if already on, notify
        return message.reply("AutoMod is already ON!");
      }
    }

    //if args is strict
    if (args[0] == `strict`) {
      if (automodNotif.autoMod != `strict`) {
        //set automod to strict
        automodNotif.autoMod = `strict`;

        //run database
        setGuild.run(automodNotif);

        //notify user
        return message.reply("AutoMod strict is turned ON!");
      } else {
        //if already on, notify
        return message.reply("AutoMod strict is already ON!");
      }
    }

    //if args is off
    if (args[0] == `off`) {
      if (automodNotif.autoMod != `1`) {
        //set automod to off
        automodNotif.autoMod = `1`;

        //run database
        setGuild.run(automodNotif);

        //notify user
        return message.reply("AutoMod is turned OFF!");
      } else {
        //if already off notify
        return message.reply("AutoMod is already OFF!");
      }
    }

    //Without args
    if (automodNotif.autoMod == `2`) {
      var optstatus = `AutoMod is ON!`;
    } else {
      var optstatus = `AutoMod is OFF!`;
    }

    //notify user
    message.reply(prefix + "automod on/off\n" + optstatus);
  },
};
