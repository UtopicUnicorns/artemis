//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "click",
  description: "[general] click",
  explain: `Inspirational quote`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("ping");
    usage.number++;
    setUsage.run(usage);

    //ping
    message.reply("\"You have to really want it.....that\'s all.\" -ClickTek 2020");
  },
};
