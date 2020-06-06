//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "purge",
  description: "[mod] Purge a mentioned user or a specified ammount",
  explain: `This command allows you to purge up to 100 messages from the channel you use this command in or from the specified user.\n
  \`purge @mention 2-100\`\n
  \`purge 2-100\``,
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

    //define amount
    const amount = !!parseInt(message.content.split(" ")[1])
      ? parseInt(message.content.split(" ")[1])
      : parseInt(message.content.split(" ")[2]);

    //if no amount
    if (!amount) return message.reply("Must specify an amount to delete!");

    //if no user and no amount
    if (!amount && !user)
      return message.reply(
        "Must specify a user and amount, or just an amount, of messages to purge!"
      );

    //fetch messages
    message.channel.messages
      .fetch({
        limit: 100,
      })
      .then((messages) => {
        //if user defined
        if (user) {
          //filter by user
          const filterBy = user ? user.id : Client.user.id;

          //define messages
          messages = messages
            .filter((m) => m.author.id === filterBy)
            .array()
            .slice(0, amount);
        } else {
          messages = messages.array().slice(0, amount);
        }
        //purge
        message.channel
          .bulkDelete(messages)
          .catch((error) => console.log(error.stack));
      });
  },
};
