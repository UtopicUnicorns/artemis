npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMsgUpdate: async function (oldMessage, newMessage) {
    //ignoredbl
    if (newMessage.guild) {
      if (newMessage.guild.id == "264445053596991498") return;
    } else {
      return;
    }
    if (newMessage.author.bot) return;
    const prefixstart = getGuild.get(newMessage.guild.id);
    const prefix = prefixstart.prefix;
    const commandName = newMessage.content
      .slice(prefix.length)
      .toLowerCase()
      .split(/ +/);
    const command = newMessage.client.commands.get(commandName.shift());
    if (!newMessage.content.startsWith(prefix)) return;
    try {
      command.execute(newMessage);
    } catch (error) {
      //
    }
  },
};
