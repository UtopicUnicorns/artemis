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
  explain: `This command allows you to purge up to 100 messages from the channel you use this command in or from the specified user.\n
  \`purge @mention 2-100\`\n
  \`purge 2-100\`\n
  \`purge WORD\`\n
  \`purge WORD 2-100\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

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
      });
  },
};
