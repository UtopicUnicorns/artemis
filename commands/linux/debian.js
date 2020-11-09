//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "debian",
  description:
    "[linux] This command gives a small description of the distribution",
  explain: `This command gives a small description of the distribution
  
  Example usage: \`!debian\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("debian");
    usage.number++;
    setUsage.run(usage);

    //create embed
    const embed = new Discord.MessageEmbed()
      .setAuthor(
        message.author.username,
        message.author.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setThumbnail(
        message.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setColor("RANDOM")
      .setTitle("Debian")
      .addField(
        "Description: \n",
        "The most stable and rock solid OS on the market."
      )
      .addField(
        "Pros: \n",
        "- main Debian is very stable\n- Has multiple branches which offer newer software\n- hundreds of derivatives are based on Debian"
      )
      .addField("Cons: \n", "- main Debian uses older software")
      .addField("Derivatives: \n", "LMDE, Ubuntu")
      .setFooter("No distribution is better than others.")
      .setTimestamp();

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
