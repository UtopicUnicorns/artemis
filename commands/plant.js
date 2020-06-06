//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "plant",
  description: "[fun] Search plants",
  explain: `This command will allow you to search some plants by their English names.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("plant");
    usage.number++;
    setUsage.run(usage);

    //define user
    let user = message.guild.members.cache.get(message.author.id);

    //define some stuff
    let baseurl =
      "https://trefle.io/api/plants?token=ajd4T3JmRXkxbWZNemVjb29Mc2dCZz09&q=";
    let q = message.content.slice(prefix.length + 6);
    let url = baseurl + q;

    //start request
    request(
      url,
      {
        json: true,
      },
      (err, res, body) => {
        //if error
        if (err) return message.channel.send(err);

        //define short
        let info = body[0];

        //if err
        if (!info) return message.reply("Not found!");

        //start request2
        request(
          info.link + "?&token=ajd4T3JmRXkxbWZNemVjb29Mc2dCZz09",
          {
            json: true,
          },
          (err, res, body) => {
            //err
            if (!body) return message.reply("error");
            //build embed
            let embed = new Discord.MessageEmbed()
              .setAuthor(
                user.user.username,
                user.user.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                })
              )
              .setColor(`RANDOM`)
              .setTitle(body.common_name);
            if (body.family) {
              if (body.family.common_name) {
                embed.addField("Family name: ", body.family.common_name);
              }
            }
            if (body.class) {
              if (body.class.name) {
                embed.addField("Scientific name: ", body.class.name);
              }
            }
            if (body.images[0]) {
              embed.setImage(body.images[0].url);
            }

            //send embed
            return message.channel.send({
              embed,
            });
          }
        );
      }
    );
  },
};
