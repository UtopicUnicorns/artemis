//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "wiki",
  description: "[fun] Wikipedia stuff",
  explain: `This command will provide a small description of a specified Wikipedia page.

Example usage: \`!wiki GNU/Linux\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("wiki");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 5);

    //wiki
    let doc = await wtf.fetch(args);

    //json
    let json = doc.json();

    //form embed
    const embed = new Discord.MessageEmbed().addField(
      args + "\n",
      json.sections[0].paragraphs[0].sentences[0].text
    );

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
