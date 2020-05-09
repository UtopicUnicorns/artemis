const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "lab",
  description: "[hidden] the lab",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("lab");
    usage.number++;
    setUsage.run(usage);
    //
    function verifyHuman(message) {
      let captcha = new Captcha2();
      const attachment = new Discord.MessageAttachment(
          captcha.PNGStream,
          "captcha.png"
        );
      message.channel.send(
        "**Enter the text shown in the image below:**",
        attachment
      );
      let collector = message.channel.createMessageCollector(
        (m) => m.author.id === message.author.id
      );
      collector.on("collect", (m) => {
        if (m.content.toUpperCase() === captcha.value)
          message.channel.send("Verified Successfully!");
        else message.channel.send("Failed Verification!");
        collector.stop();
      });
    }
    verifyHuman(message);
  },
};
