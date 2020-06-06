//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "ask",
  description: "[linux] Ask Ubuntu api",
  explain: `By using the AskUbuntu API you can get somewhat flawed answers if you use \`ask QuerY\``,
  execute(message) {
    //start prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("ask");
    usage.number++;
    setUsage.run(usage);

    //define stuff
    let baseurl =
      "https://api.stackexchange.com/2.2/search/advanced?pagesize=1&order=desc&sort=votes&q=";
    let q = message.content.slice(prefix.length + 4);
    let key = "&site=askubuntu&key=" + configfile.askkey;
    let url = baseurl + q + key;

    //start request
    request(
      url,
      {
        gzip: true,
        json: true,
      },
      (error, response, body) => {
        //if no body
        if (body.items < 1) return message.reply("Page not found!");

        //define embed
        const embed = new Discord.MessageEmbed()
          .setTitle(body.items[0].title)
          .setAuthor(
            body.items[0].owner.display_name,
            body.items[0].owner.profile_image
          )
          .attachFiles(["./modules/img/ask.png"])
          .setThumbnail("attachment://ask.png")
          .setURL(body.items[0].link)
          .setColor("RANDOM")
          .setDescription(
            `Created at: ${moment
              .utc(body.items[0].creation_date)
              .format("dddd, MMMM Do YYYY, HH:mm:ss")}`
          )
          .addField(body.items[0].title + "\n", body.items[0].closed_reason)
          .addField("Link: ", body.items[0].link)
          .addField("Answers: ", body.items[0].answer_count)
          .addField("Views: ", body.items[0].view_count)
          .addField("Score: ", body.items[0].score)
          .setFooter("tags: " + body.items[0].tags);

        //send embed
        message.channel.send({
          embed: embed,
        });
      }
    );
  },
};
