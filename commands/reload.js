const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "reload",
  description: "[mod] reload a command",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.hasPermission("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("reload");
    usage.number++;
    setUsage.run(usage);
    //
    const args = message.content.slice(prefix.length + 7);
    if (!args) return message.reply('Specify a command to reload!');
    const commandName = args;
    if (!message.client.commands.has(commandName)) {
     return message.reply("That command does not exist");
    }
    delete require.cache[require.resolve(`./${commandName}.js`)];
    message.client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    message.client.commands.set(commandName, props);
    message.reply(`The command ${commandName} has been reloaded`);
  },
};
