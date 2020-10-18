//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "massrole",
  description: "[mod] Give mentioned role to everyone",
  explain: `By mentioning a role in this command you can give the selected role to everyone.
  
  Example usage: \`massrole @role\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user has perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("massrole");
    usage.number++;
    setUsage.run(usage);

    return message.reply("This command is temporarely disabled due to well I have no damn clue.. Something is wrong reeee!");

    const Role = message.mentions.roles.first();

    message.guild.members.cache.filter(m => !m.user.bot).forEach(member => member.roles.add(Role))

    message.channel.send(`Added role ${Role.name}`);
  },
};
