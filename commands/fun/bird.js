//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "bird",
  description: "[fun] Random bird picture",
  explain: `Using \`bird\` will display a random bird picture from the some-random-api.ml website.`,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("bird");
    usage.number++;
    setUsage.run(usage);

    //define some prestuff
    let baseurl = "https://some-random-api.ml/img/birb";
    let url = baseurl;

    //start request
    request(
      url,
      {
        json: true,
      },
      (err, res, body) => {
        //on error
        if (err) return message.channel.send(err);

        //build embed
        const embed = new Discord.MessageEmbed().setImage(body.link);

        //embed
        message.channel.send({
          embed: embed,
        });
      }
    );
  },
};
