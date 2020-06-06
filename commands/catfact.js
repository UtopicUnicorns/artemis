//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "catfact",
  description: "[fun] Random cat fact",
  explain: `The \`catfact\` command grabs a random fact from the some-random-api.ml website`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("catfact");
    usage.number++;
    setUsage.run(usage);

    //define some stuff
    let baseurl = "https://some-random-api.ml/facts/cat";
    let url = baseurl;

    //start request
    request(
      url,
      {
        json: true,
      },
      (err, res, body) => {
        //if error
        if (err) return message.channel.send(err);

        //send message
        message.channel.send(body.fact);
      }
    );
  },
};
