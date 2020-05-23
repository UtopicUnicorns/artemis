//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "btw",
  description:
    "[linux] Shows a random Distribution (Anonymous donation command)",
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("btw");
    usage.number++;
    setUsage.run(usage);

    //start curl
    curl.get("https://distrowatch.com/random.php", function (
      error,
      response,
      body
    ) {
      //process body
      let test = htmlText(body).split("\n");

      //define emoji
      const kappa = message.client.emojis.cache.find(
        (emoji) => emoji.name === "kappa"
      );

      //send message
      message.reply("I use " + test[0].slice(17) + ` btw ${kappa}`);
    });
  },
};
