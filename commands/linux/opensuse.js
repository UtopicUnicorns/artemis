//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "opensuse",
  description:
    "[linux] This command gives a small description of the distribution",
  explain: `This command gives a small description of the distribution
  
  Example usage: \`!opensuse\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("opensuse");
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
      .setTitle("openSUSE")
      .addField(
        "Description: \n",
        "OpenSUSE is a Linux-based project and distribution sponsored by SUSE Linux GmbH and other companies."
      )
      .addField(
        "Pros: \n",
        "- Offers YAST\n- Has a great build service\n- has a stable release and a rolling release"
      )
      .addField("Cons: \n", "- Does not offer a lot of Desktop Environments")
      .addField("Derivatives: \n", "GeckoLinux")
      .setFooter("No distribution is better than others.")
      .setTimestamp();

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
