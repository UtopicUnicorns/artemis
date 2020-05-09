const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "add",
  description: "[mscore] Give a user points or take them",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const getScore = db.prepare(
      "SELECT * FROM scores WHERE user = ? AND guild = ?"
    );
    const setScore = db.prepare(
      "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
    );
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    let guildChannels2 = getGuild.get(message.guild.id);
    if (guildChannels2) {
      if (guildChannels2.leveling == "2") {
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );
      } else {
        let args = message.content.slice(prefix.length + 4).split(" ");
        if (!args[0]) {
          return message.reply("You must mention someone or give their ID!");
        }
        if (message.guild.members.cache.get(args[0])) {
          var user = message.guild.members.cache.get(args[0]);
        }
        if (args[0].startsWith("<@") && args[0].endsWith(">")) {
          var user = message.guild.members.cache.get(
            message.mentions.users.first().id
          );
        }
        if (!user)
          return message.reply("You must mention someone or give their ID!");
        const pointsToAdd = parseInt(args[1], 10);
        if (!pointsToAdd)
          return message.reply("You didn't tell me how many points to give...");
        let userscore = getScore.get(user.user.id, message.guild.id);
        if (!userscore)
          return "This user has no Database entry, and we will not give them one trough this command.";
        userscore.points += pointsToAdd;
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        setScore.run(userscore);
        //LOGS
        const guildChannels = getGuild.get(message.guild.id);
        var logger = message.guild.channels.cache.get(guildChannels.logsChannel);
        if (!logger) {
          var logger = "0";
        }
        if (logger == "0") {
        } else {
          const logsmessage = new Discord.MessageEmbed()
            .setTitle(prefix + "add")
            .setAuthor(message.author.username, message.author.avatarURL())
            .setDescription("Used by: " + message.author)
            .setURL(message.url)
            .setColor("RANDOM")
            .addField("Usage:\n", message.content, true)
            .addField("Channel", message.channel, true)
            .setFooter("Message ID: " + message.id)
            .setTimestamp();
          logger
            .send({
              embed: logsmessage,
            })
            .catch((error) =>
              console.log(
                moment().format("MMMM Do YYYY, HH:mm:ss") +
                  "\n" +
                  __filename +
                  ":" +
                  ln()
              )
            );
        }

        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare(
          "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
        );
        usage = getUsage.get("add");
        usage.number++;
        setUsage.run(usage);
        //
        return message.channel.send(
          `${user.user.username} has gotten: ${pointsToAdd} Points.\nYou have ${userscore.points} points now.\nAnd your level is ${userscore.level}`
        );
      }
    }
  },
};
