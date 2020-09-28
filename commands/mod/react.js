//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "react",
  description: "[mod] Add CUSTOM EMOTE reactions to a message",
  explain: `This command will try to add custome emoji reactions to a specified message in the channel you use this command in.\n
  \`react messageID emojiName1 emojiName2\`\n
  Do not that the emojis have to be custom!`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    //if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("react");
    usage.number++;
    setUsage.run(usage);

    //if no args
    if (message.content == prefix + "react")
      //reply
      return message.reply(
        prefix + "react MessageID EmoteName EmoteName EmoteName..."
      );

    //define args
    let args = message.content.slice(prefix.length + 6).split(" ");

    //empty array
    let array = [];

    //loop trough args
    for (let i of args) {
      //if args is not args 0
      if (i !== args[0]) {
        //push args into array
        array.push(i);
      }
    }

    //fetch channel message
    message.channel.messages
      .fetch(args[0])
      .then((messages) => {
        //for each in array
        for (let n in array) {
          //if amount is over 19
          if (n > 19) return;

          //if emoji exists
          if (message.guild.emojis.cache.find((r) => r.name == array[n])) {
            //define emoji
            var emoji = [
              message.guild.emojis.cache.find((r) => r.name == array[n]),
            ];

            //loop trough emoji
            for (let i in emoji) {
              //react to message
              messages.react(emoji[i]);
            }
          }
        }
      })
      .catch((error) => {
        //error
        message.reply("Message ID does not exist");
      });
  },
};
