//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "lenny",
  description: "[fun] ( ͡° ͜ʖ ͡°)",
  explain: `Yeah... let's not explain this.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("lenny");
    usage.number++;
    setUsage.run(usage);

    //channel list
    let channelAllow = [
      "692762201991282778",
      "702267558195232868",
      "605900394803232778",
      "729049434276757545",
      "739906723699228722",
    ];

    //loop
    for (let i of channelAllow) {
      //if not channel
      if (message.channel.id == i) {
        //define args
        let args = message.content
          .toLowerCase()
          .slice(prefix.length + 6)
          .split(" ");

        //if no args
        if (!args[0]) {
          request(`https://aranym.com/artemis-categories`, (err, res, body) => {
            //if err
            if (!body) return message.reply("An error occured");

            //split body
            body = body.split("\n");

            return message.reply(
              `\`\`\`diff\n- Pick a category:\n\n+ ${body.join(
                `\n+ `
              )}\n\n\`\`\``
            );
          });
        }

        //if args[1]
        if (args[1]) {
          //build embed
          const embed = new Discord.MessageEmbed().setImage(
            `https://aranym.com/${args[0]}/${args[1]}.jpg`
          );

          //send embed
          return message.channel.send({
            embed: embed,
          });
        }

        //request
        request(`https://aranym.com/${args[0]}/filenames`, (err, res, body) => {
          //if err
          if (!body) return message.reply("Category not found!");

          //sort body
          body = body.split("\n");
          body = body.slice(Math.max(body.length - 3, 0));
          body = body[0].split(".");

          //define number
          number = body[0];

          //define random
          let num = Math.floor(Math.random() * number + 1);

          //build embed
          const embed = new Discord.MessageEmbed().setImage(
            `https://aranym.com/${args[0]}/${num}.jpg`
          );

          //send embed
          return message.channel.send({
            embed: embed,
          });
        });
      }
    }
  },
};
