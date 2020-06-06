//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "reload",
  description: "[mod] reload a command",
  explain: `This command allows you to reload a specified command to update new code and such.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("reload");
    usage.number++;
    setUsage.run(usage);

    //define args
    const args = message.content.slice(prefix.length + 7);

    //if no args
    if (!args) return message.reply("Specify a command to reload!");

    //define commandname
    const commandName = args;

    //if client does not have that command
    if (!message.client.commands.has(commandName)) {
      return message.reply("That command does not exist");
    }

    //delete cache for command
    delete require.cache[require.resolve(`./${commandName}.js`)];

    //delete from set
    message.client.commands.delete(commandName);

    //reload command
    const props = require(`./${commandName}.js`);

    //pour into set
    message.client.commands.set(commandName, props);

    //notify
    message.reply(`The command ${commandName} has been reloaded`);
  },
};
