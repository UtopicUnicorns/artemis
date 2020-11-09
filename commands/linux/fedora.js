//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "fedora",
  description:
    "[linux] This command gives a small description of the distribution",
  explain: `This command gives a small description of the distribution
  
  Example usage: \`!fedora\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("fedora");
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
      .setTitle("Fedora")
      .addField(
        "Description: \n",
        "Fedora is designed as a secure, general purpose operating system. The operating system is developed on a six-month release cycle, under the auspices of the Fedora Project. Fedora is sponsored by Red Hat."
      )
      .addField(
        "Pros: \n",
        "- Superior support\n- Backed by major companies\n - also offers CentOS"
      )
      .addField("Cons: \n", "- Proprietary drivers are unsupported")
      .addField("Derivatives: \n", "CentOS, ClearOS, RHEL.")
      .setFooter("No distribution is better than others.")
      .setTimestamp();

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
