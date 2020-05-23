//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "specs",
  description: "[linux] Add your hardware specifications to !userinfo",
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("specs");
    usage.number++;
    setUsage.run(usage);

    //iff plain this
    if (message.content == `${prefix}specs`) {
      //inform user
      return message.channel.send(
        "use `neofetch --stdout` in your console.\nThen paste it here using:\n" +
          prefix +
          "specs [neofetch output]\n\nYou can check if you have your specifications setup with " +
          prefix +
          " userinfo"
      );
    }

    //build for database
    specsSet = {
      uid: message.author.id,
      spec: message.content.slice(prefix.length + 6, 1000),
    };

    //run database
    setSpecs.run(specsSet);

    //delete message
    message.delete({
      timeout: 2000,
      reason: "It had to be done.",
    });

    //notify
    message.reply(`Specs updated!`);
  },
};
