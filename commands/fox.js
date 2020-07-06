//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "fox",
  description: "[fun] Random fox picture",
  explain: `This command will show you a random fox picture grabbed from some-random-api.ml`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("fox");
    usage.number++;
    setUsage.run(usage);

    //define stuff
    let baseurl = "https://some-random-api.ml/img/fox";
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

        //build embed
        const embed = new Discord.MessageEmbed().setImage(body.link);

        //send embed
        message.channel.send({
          embed: embed,
        });
      }
    );
  },
};
