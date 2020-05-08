const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "specs",
  description: "[linux] Add your hardware specifications to !userinfo",
  execute(message) {
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    usage = getUsage.get("specs");
    usage.number++;
    setUsage.run(usage);
    //
    if (message.content == `${prefix}specs`) {
      return message.channel.send(
        "use `neofetch --stdout` in your console.\nThen paste it here using:\n" +
          prefix +
          "specs [neofetch output]\n\nYou can check if you have your specifications setup with " +
          prefix +
          " userinfo"
      );
    }
    specsSet = {
      uid: message.author.id,
      spec: message.content.slice(prefix.length + 6, 1000),
    };
    setSpecs.run(specsSet);
    message.delete(2000);
    message.reply(`Specs updated!`);
  },
};
