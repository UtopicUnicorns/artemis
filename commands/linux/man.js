//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "man",
  description: "[linux] Shows linux manual pages",
  explain: `This command allows you to view manual pages provided by cheat.sh

Example usage: \`!man neofetch\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("man");
    usage.number++;
    setUsage.run(usage);

    //if no args
    if (message.content === `${prefix}man`) {
      return message.channel.send(`${prefix}man ARGS`);
    }

    //define args
    let args = message.content.slice(prefix.length + 4);

    //define stuff
    let baseurl = `https://cheat.sh/`;
    let search = args;
    let url = baseurl + search;

    //curl start
    curl.get(url, function (error, response, body) {
      //process body
      let test = htmlText(body).split("\n");
      let test2 = test.slice(4203).join("\n");
      let text = test2.split("Follow @igor_chubin");

      //if text is over 2k characters
      if (text[0].length > 2000) {
        //send split message
        return message.channel.send(`${text[0]}`, {
          split: true,
        });
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setTitle(args)
        .setDescription(text[0])
        .setColor("RANDOM");

      //send embed
      message.channel.send({
        embed,
      });
    });
  },
};
