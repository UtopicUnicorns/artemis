//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "arch",
  description:
    "[linux] This command gives a small description of the distribution",
  explain: `This command gives a small description of the distribution
  
  Example usage: \`!arch\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("arch");
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
      .setTitle("Arch")
      .addField(
        "Description: \n",
        "Arch Linux is an independently developed, x86-64 general-purpose GNU/Linux distribution that strives to provide the latest stable versions of most software by following a rolling-release model. The default installation is a minimal base system, configured by the user to only add what is purposely required."
      )
      .addField(
        "Pros: \n",
        "- Minimal Install\n- Latest software\n- Easy to use after instalation"
      )
      .addField(
        "Cons: \n",
        "- Semi hard to install\n- Not very stable compared to other distributions\n- Has no apps/wm/de/dm on first launch."
      )
      .addField("Derivatives: \n", "Arco Linux, Artix, Manjaro")
      .setFooter("No distribution is better than others.")
      .setTimestamp();

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
