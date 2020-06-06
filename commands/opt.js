//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "opt",
  description: `[general] opt in out out from translation`,
  explain: `This command shows you if you have Automatic translation enabled for your messages.\n
  By default this setting is OFF, but you can turn it on trough the Artemis website.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("opt");
    usage.number++;
    setUsage.run(usage);

    //pull data
    let translate = getScore.get(message.author.id, message.guild.id);

    //define on or off
    if (translate.translate == `2`) {
      var optstatus = `Auto Translation is ON!`;
    } else {
      var optstatus = `Auto Translation is OFF!`;
    }

    //form embed
    const embed = new Discord.MessageEmbed()
      .setTitle("Autotranslation")
      .setDescription("change this on https://artemisbot.eu/")
      .setColor("RANDOM")
      .addField("Auto translations is: ", optstatus);

    //send embed
    message.channel.send({
      embed,
    });
  },
};
