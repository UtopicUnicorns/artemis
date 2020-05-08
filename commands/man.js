const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
  name: "man",
  description: "[linux] Shows linux manual pages",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("man");
    usage.number++;
    setUsage.run(usage);
    //
    if (message.content === `${prefix}man`) {
      return message.channel.send(`${prefix}man ARGS`);
    }
    let args = message.content.slice(prefix.length + 4);
    let baseurl = `https://cheat.sh/`;
    let search = args;
    let url = baseurl + search;
    curl.get(url, function(error, response, body) {
      let test = htmlText(body).split("\n");
      let test2 = test.slice(4203).join("\n");
      let text = test2.split("Follow @igor_chubin");
      if (text[0].length > 2000) {
        return message.channel.send(`${text[0]}`, {
          split: true
        });
      }
      let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle(args)
        .setDescription(text[0])
        .setColor("RANDOM");
      message.channel.send({
        embed
      });
    });
  }
};
