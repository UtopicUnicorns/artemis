//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onMsgUpdate: async function (oldMessage, newMessage) {
    //if bot
    if (newMessage.author.bot) return;

    //load prefix
    const prefixstart = getGuild.get(newMessage.guild.id);
    const prefix = prefixstart.prefix;

    //define command name
    const commandName = newMessage.content
      .slice(prefix.length)
      .toLowerCase()
      .split(/ +/);

    //define command
    const command = newMessage.client.commands.get(commandName.shift());

    //if command does not start with prefix
    if (!newMessage.content.startsWith(prefix)) return;

    //do your shit
    try {
      command.execute(newMessage);
    } catch (error) {
      //
    }
  },
};
