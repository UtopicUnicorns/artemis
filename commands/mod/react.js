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
  explain: `This command is a core command for [Reaction_Roles](#Reaction_Roles).

This command only accepts CUSTOM emojis. You can add as many to this command as a message can hold.
When used properly, the React command will react to the message you specified with the specified emojis.

_The react command in combination with the message ID should ONLY be used WITHIN the channel the message originates from._

Example usage: \`!react MessageID EmojiName EmojiName EmojiName\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

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
