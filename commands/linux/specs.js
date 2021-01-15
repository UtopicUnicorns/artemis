//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `linux`,
  name: "specs",
  description: "[linux] Add your hardware specifications to !userinfo",
  explain: `This command will allow you to upload a piece of text to your Userinfo.
Users typically use this command to share their system specification.

Example usage: \`!specs view UserID\`

Example usage: 
\`\`\`sh
!specs set neofetch
output
output
\`\`\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("specs");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 6).split(" ");

    if (!args[0]) {
      return message.channel.send(
        `use \`neofetch --stdout\` in your console.
        Then paste it here using:
          ${prefix}specs set [neofetch output]
          
          You can check if you have your specifications setup with
          \`${prefix}specs view\``
      );
    }

    if (args[0] == "set") {
      //build for database
      specsSet = {
        uid: message.author.id,
        spec: message.content.slice(prefix.length + 10, 1000),
      };

      //run database
      setSpecs.run(specsSet);

      //delete message
      message.delete({
        timeout: 2000,
        reason: "It had to be done.",
      });

      //notify
      message.reply(`Specs updated!\nView your specs with ${prefix}specs view`);
    }

    if (args[0] == "view") {
      //form user
      if (!args[1]) {
        var user = message.guild.members.cache.get(message.author.id);
      } else {
        if (message.guild.members.cache.get(args[1])) {
          var user = message.guild.members.cache.get(args[1]);
        }
        if (args[1].startsWith("<@") && args[1].endsWith(">")) {
          var user = message.guild.members.cache.get(
            message.mentions.users.first().id
          );
        }
      }

      //pull data
      let entryYes = getSpecs.get(user.user.id);

      if (!entryYes) {
        return message.reply("This user does not have specifications set up.");
      } else {
        return message.channel.send(`Specifications for ${user.user.username}:
        
${getSpecs.get(user.user.id).spec.replace(/\@/g, "")}
        `);
      }
    }
  },
};
