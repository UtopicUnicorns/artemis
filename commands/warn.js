const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "warn",
  description: "[mod] Warn a user",
  async execute(message) {
    const getScore = db.prepare(
      "SELECT * FROM scores WHERE user = ? AND guild = ?"
    );
    const setScore = db.prepare(
      "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
    );
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const guildChannels = getGuild.get(message.guild.id);
    var muteChannel1 = message.guild.channels.cache.get(guildChannels.muteChannel);
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("warn");
    usage.number++;
    setUsage.run(usage);
    //
    const user = message.mentions.users.first();
    if (!user) return message.reply("You must mention someone!");
    const args = message.content.slice(prefix.length + user.id.length + 10);
    if (!args) {
      var warningtext = "No reason given.";
    } else {
      var warningtext = args;
    }
    const pointsToAdd = parseInt(1, 10);
    let userscore = getScore.get(user.id, message.guild.id);
    if (!userscore) {
      userscore = {
        id: `${message.guild.id}-${user.id}`,
        user: user.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };
    }
    userscore.notes = warningtext;
    userscore.warning += pointsToAdd;
    if (userscore.warning > 2) {
      const member = message.mentions.members.first();
      let array = [];
      message.client.channels.cache
        .filter((channel) => channel.guild.id === message.guild.id)
        .map((channels) => array.push(channels.id));
      let count = "0";
      for (let i of array) {
        setTimeout(() => {
          count++;
          let channel = message.guild.channels.cache.find(
            (channel) => channel.id === i
          );
          if (channel) {
            if (muteChannel1) {
              if (i == muteChannel1.id) {
                channel.overwritePermissions(member, {
                  VIEW_CHANNEL: true,
                  READ_MESSAGES: true,
                  SEND_MESSAGES: true,
                  READ_MESSAGE_HISTORY: true,
                  ATTACH_FILES: false,
                });
                return channel.send(
                  member + "\nYou collected 3 warnings, you have been muted!"
                );
              }
            }
            channel.overwritePermissions(member, {
              VIEW_CHANNEL: false,
              READ_MESSAGES: false,
              SEND_MESSAGES: false,
              READ_MESSAGE_HISTORY: false,
              ADD_REACTIONS: false,
            });
          }
        }, 200 * count);
      }
      let memberrole = message.guild.roles.cache.find((r) => r.name === `~/Members`);
      if (memberrole) {
        setTimeout(() => {
          member.roles.remove(memberrole).catch(console.log());
        }, 2500);
      }
      userscore.muted = `1`;
    }
    setScore.run(userscore);
    //LOGS
    const guildChannels2 = getGuild.get(message.guild.id);
    var logger = message.guild.channels.cache.get(guildChannels2.logsChannel);
    if (!logger) {
      var logger = "0";
    }
    if (logger == "0") {
    } else {
      setTimeout(() => {
        const logsmessage = new Discord.MessageEmbed()
          .setTitle(prefix + "warn")
          .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
          .setDescription("Used by: " + `${message.author}`)
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
      }, 3500);
    }
    //
    return message.channel.send(
      `${user} has been warned!\nYou have ${userscore.warning} warning(s)`
    );
  },
};
