//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "purge",
  description: "[mod] Purge a mentioned user or a specified ammount",
  explain: `Purging is one of the main features of a Discord bot.
This command will wipe a specified ammount of messages from the channel you use it in.
Due to API limitations, you can only purge 100 messages at a time, and only up to 2 weeks ago.
Artemis allows you to purge from a mentioned user too, or a keyword which will remove up to 100 messages containing that word.

Example usage: \`!purge 100\`

Example usage: \`!purge @mention 100\`

Example usage: \`!purge KeyWord 100\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //update usage
    usage = getUsage.get("purge");
    usage.number++;
    setUsage.run(usage);

    //define user
    const user = message.mentions.users.first();

    //define args
    const args = message.content.slice(prefix.length + 6).split(" ");

    //when no args
    if (!args[0]) {
      return message.reply("Specify a user, amount or word to purge.");
    }

    //fetch messages
    message.channel.messages
      .fetch({
        limit: 100,
      })
      .then((messages) => {
        //if arg 0 is number
        if (args[0].match(/^[0-9]+$/) != null) {
          //set ammount
          let amount = args[0];

          //define messages
          messages = messages.array().slice(0, amount);

          //purge
          return message.channel
            .bulkDelete(messages)
            .catch((error) => console.log(error.stack));
        }

        //word filter
        if (!user) {
          if (args[0]) {
            //if no second arg
            if (!args[1]) {
              //word to purge
              let fuckOff = args[0].toLowerCase();

              //set ammount
              let amount = 99;

              //define messages
              messages = messages
                .filter((m) => m.content.toLowerCase().includes(fuckOff))
                .array()
                .slice(0, amount);

              //purge
              return message.channel
                .bulkDelete(messages)
                .catch((error) => console.log(error.stack));
            }

            //if number is defined
            if (args[1].match(/^[0-9]+$/) != null) {
              //word to purge
              let fuckOff = args[0].toLowerCase();

              //set ammount
              let amount = args[1];

              //define messages
              messages = messages
                .filter((m) => m.content.toLowerCase().includes(fuckOff))
                .array()
                .slice(0, amount);

              //purge
              return message.channel
                .bulkDelete(messages)
                .catch((error) => console.log(error.stack));
            }
          }
        }

        //if user defined
        if (user) {
          //if number is specified
          if (args[1]) {
            if (args[1].match(/^[0-9]+$/) != null) {
              //set ammount
              let amount = args[1];

              //define messages
              messages = messages
                .filter((m) => m.author.id === user.id)
                .array()
                .slice(0, amount);

              //purge
              return message.channel
                .bulkDelete(messages)
                .catch((error) => console.log(error.stack));
            }
          }
        }
      });
  },
};
