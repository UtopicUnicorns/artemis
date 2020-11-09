//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "ubuntu",
  description:
    "[linux] This command gives a small description of the distribution",
  explain: `This command gives a small description of the distribution
  
  Example usage: \`!ubuntu\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("ubuntu");
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
      .setTitle("Ubuntu")
      .addField(
        "Description: \n",
        "Ubuntu is an open-source operating system (OS) based on the Debian GNU/Linux distribution. "
      )
      .addField(
        "Pros: \n",
        "- Easy to Install\n- Stable Software\n- Very easy to use\n- Has a lot of flavours"
      )
      .addField(
        "Cons: \n",
        "- Uses Snap\n- Has a lot of derivatives\n- main Ubuntu uses GNOME as a desktop environment, and may be too heavy for second-life systems"
      )
      .addField("Derivatives: \n", "Linux Mint, Kubuntu, Lubuntu, Xubuntu")
      .setFooter("No distribution is better than others.")
      .setTimestamp();

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
