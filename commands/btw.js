const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "btw",
  description: "[linux] Shows a random Distribution (Anonymous donation command)",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("btw");
    usage.number++;
    setUsage.run(usage);
    //
    curl.get("https://distrowatch.com/random.php", function(error, response, body) {
      let test = htmlText(body).split("\n");
      const kappa = message.client.emojis.find(emoji => emoji.name === "kappa");
        message.reply('I use ' + test[0].slice(17) + ` btw ${kappa}`)
    });
  }
};
