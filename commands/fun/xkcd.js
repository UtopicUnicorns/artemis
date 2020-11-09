//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "xkcd",
  description: "[fun] Xkcd images",
  explain: `This command will show you an XKCD comic.

Example usage: \`!xkcd\` _Shows the most recent comic_

Example usage: \`!xkcd NUMBER\` _Shows the specified comic coresponding to the number you provided_

Example usage: \`!xkcd random\` _Shows a random comic_`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("xkcd");
    usage.number++;
    setUsage.run(usage);

    //if random
    if (message.content == `${prefix}xkcd random`) {
      //build stuff
      let baseurl = `https://xkcd.com/`;
      let num = Math.floor(Math.random() * 2200) + 1;
      let end = `/info.0.json`;
      let url = baseurl + num + end;

      //request start
      request(
        url,
        {
          json: true,
        },
        (err, res, body) => {
          //if error
          if (err) return message.channel.send(err);

          //form embed
          const embed = new Discord.MessageEmbed()
            .setTitle(body.safe_title)
            .setURL(`https://xkcd.com/${body.num}/`)
            .setColor("#RANDOM")
            .setImage(body.img)
            .setFooter(body.alt);

          //send embed
          message.channel.send({
            embed: embed,
          });
        }
      );
      return;
    }

    //form args
    let args = message.content.slice().split(` `);

    //if no args
    if (!args[1]) {
      //url
      let url = `https://xkcd.com/info.0.json`;

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
          const embed = new Discord.MessageEmbed()
            .setTitle(body.safe_title)
            .setURL(`https://xkcd.com/${body.num}/`)
            .setColor("#RANDOM")
            .setImage(body.img)
            .setFooter(body.alt);

          //send embed
          message.channel.send({
            embed: embed,
          });
        }
      );
      return;
    }

    //build stuff
    let baseurl = `https://xkcd.com/`;
    let num = args[1];
    let end = `/info.0.json`;
    let url = baseurl + num + end;

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
        const embed = new Discord.MessageEmbed()
          .setTitle(body.safe_title)
          .setURL(`https://xkcd.com/${body.num}/`)
          .setColor("#RANDOM")
          .setImage(body.img)
          .setFooter(body.alt);

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
    );
  },
};
