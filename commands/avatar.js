//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "avatar",
  description: "[fun] Show a user avatar",
  explain: `This will show a users profile picture, either use \`avatar @mention\`, \`avatar userID\` or \`avatar\``,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("avatar");
    usage.number++;
    setUsage.run(usage);

    //defien args
    let args = message.content.slice(prefix.length + 7).split(" ");

    //self
    if (!args[0]) {
      var user = message.guild.members.cache.get(message.author.id);
    }

    //plain ID
    if (message.guild.members.cache.get(args[0])) {
      var user = message.guild.members.cache.get(args[0]);
    }

    //mention
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      var user = message.guild.members.cache.get(
        message.mentions.users.first().id
      );
    }

    //build embed
    const embed = new Discord.MessageEmbed().setImage(
      user.user.displayAvatarURL({ format: "jpg" })
    );

    //send embed
    message.channel.send({
      embed: embed,
    });
  },
};
