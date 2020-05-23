//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "add",
  description: "[mscore] Give a user points or take them",
  execute(message) {
    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("add");
    usage.number++;
    setUsage.run(usage);

    //if user does not have proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //define guildchannel
    let guildChannels2 = getGuild.get(message.guild.id);

    //if channel
    if (guildChannels2) {
      //if leveling is off for the server
      if (guildChannels2.leveling == "2") {
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );

        //if leveling is on
      } else {
        //define args
        let args = message.content.slice(prefix.length + 4).split(" ");

        //if no args
        if (!args[0]) {
          return message.reply("You must mention someone or give their ID!");
        }

        //if user plain ID
        if (message.guild.members.cache.get(args[0])) {
          var user = message.guild.members.cache.get(args[0]);
        }

        //if user mention
        if (args[0].startsWith("<@") && args[0].endsWith(">")) {
          var user = message.guild.members.cache.get(
            message.mentions.users.first().id
          );
        }

        //if no user
        if (!user)
          return message.reply("You must mention someone or give their ID!");

        //define points
        const pointsToAdd = parseInt(args[1], 10);

        //if no points defined
        if (!pointsToAdd)
          return message.reply("You didn't tell me how many points to give...");

        //define userscore
        let userscore = getScore.get(user.user.id, message.guild.id);

        //if no userscore
        if (!userscore)
          return "This user has no Database entry, and we will not give them one trough this command.";

        //set old points to new points
        userscore.points += pointsToAdd;

        //check user level
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));

        //old level to new level
        userscore.level = userLevel;

        //save into database
        setScore.run(userscore);

        //reply to user notify
        return message.channel.send(
          `${user.user.username} has gotten: ${pointsToAdd} Points.\nYou have ${userscore.points} points now.\nAnd your level is ${userscore.level}`
        );
      }
    }
    //if something goes wrong
    return message.reply("An error occured, try again!");
  },
};
