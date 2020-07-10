//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "rules",
  description: "[mod] Show rules",
  explain: `This command will show you the server rules.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("rules");
    usage.number++;
    setUsage.run(usage);

    //rules
    let rules = [
      "Hate and disrespectful speech including usernames, voicechat, nicknames and DM's is forbidden.",
      "Spamming and flooding is forbidden, except for happy birthday spam.",
      "NSFW content is forbidden, inside the adult and secret channel nsfw is allowed within the boundaries of the Discord ToS.",
      "Support questions go into the support channels, the same counts for other topics belong in their respective channels.",
      "Spreading personal info is forbidden, when the other parties and a staff member agree then it may be allowed.",
      "Keep discussions respectful.",
      "Advertising is forbidden unless you have explicit permission from a staff member.",
      "Politics talk is strictly forbidden in all channels other than the politics channels.",
      "When the rules do not cover a specific situation, then the staff are free to do as they see fit.",
      "Keep the Discord ToS in mind, depending on this we may or may not remove a message or take action even if it is not covered by our rules.",
    ];
    //form embed
    let embed = new Discord.MessageEmbed()
      .setTitle("Server Rules")
      .setAuthor(
        message.author.username,
        message.author.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setColor(`RANDOM`)
      .setThumbnail(
        message.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setURL("https://discord.gg/dSCqtqj")
      .setFooter(
        "Violating these rules may cause a kick, mute or ban from the server."
      );

    //count
    let count = "0";

    //loop rules
    for (let i of rules) {
      //up count
      count++;

      //shoot field
      embed.addField(`(${count}) `, `${i}`);
    }

    //send embed
    return message.channel.send({
      embed: embed,
    });
  },
};
