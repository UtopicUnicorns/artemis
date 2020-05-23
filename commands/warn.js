//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "warn",
  description: "[mod] Warn a user",
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //form guild channels
    const guildChannels = getGuild.get(message.guild.id);

    //form mute channel
    var muteChannel1 = message.guild.channels.cache.get(
      guildChannels.muteChannel
    );

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("warn");
    usage.number++;
    setUsage.run(usage);

    //form user
    const user = message.mentions.users.first();

    //if no user
    if (!user) return message.reply("You must mention someone!");

    //form args
    const args = message.content.slice(prefix.length + user.id.length + 10);

    //if no args
    if (!args) {
      var warningtext = "No reason given.";
    } else {
      var warningtext = args;
    }

    //add warning point
    const pointsToAdd = parseInt(1, 10);

    //pull user data
    let userscore = getScore.get(user.id, message.guild.id);

    //if no user
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

    //add warning text
    userscore.notes = warningtext;

    //add warning point
    userscore.warning += pointsToAdd;

    //if user has over 2 warnings
    if (userscore.warning > 2) {
      //define member
      const member = message.mentions.members.first();

      //empty array
      let array = [];

      //push channels into array
      message.client.channels.cache
        .filter((channel) => channel.guild.id === message.guild.id)
        .map((channels) => array.push(channels.id));

      //count
      let count = "0";

      //remove rights from all channels in array
      for (let i of array) {
        setTimeout(() => {
          count++;
          let channel = message.guild.channels.cache.find(
            (channel) => channel.id === i
          );
          if (channel) {
            if (muteChannel1) {
              if (i == muteChannel1.id) {
                channel.createOverwrite(member, {
                  VIEW_CHANNEL: true,
                  READ_MESSAGES: true,
                  SEND_MESSAGES: true,
                  READ_MESSAGE_HISTORY: true,
                  ATTACH_FILES: false,
                });
                return channel.send(
                  `${member}` +
                    "\nYou collected 3 warnings, you have been muted!"
                );
              }
            }
            channel.createOverwrite(member, {
              VIEW_CHANNEL: false,
              READ_MESSAGES: false,
              SEND_MESSAGES: false,
              READ_MESSAGE_HISTORY: false,
              ADD_REACTIONS: false,
            });
          }
        }, 200 * count);
      }

      //fetch role
      let memberrole = message.guild.roles.cache.find(
        (r) => r.name === `~/Members`
      );

      //if member role
      if (memberrole) {
        //anti api spam
        setTimeout(() => {
          //remove role
          member.roles.remove(memberrole).catch(console.log());
        }, 2500);
      }

      //set muted to yes
      userscore.muted = `1`;
    }

    //run database
    setScore.run(userscore);

    //form guild channels
    const guildChannels2 = getGuild.get(message.guild.id);

    //form logs channel
    var logger = message.guild.channels.cache.get(guildChannels2.logsChannel);

    //if no log channel
    if (!logger) var logger = "0";

    //if logs channel
    if (logger !== "0") {
      //anti api spam
      setTimeout(() => {
        //form embed
        const logsmessage = new Discord.MessageEmbed()
          .setTitle(prefix + "warn")
          .setAuthor(
            message.author.username,
            message.author.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setDescription("Used by: " + `${message.author}`)
          .setURL(message.url)
          .setColor("RANDOM")
          .addField("Usage:\n", message.content, true)
          .addField("Channel", message.channel, true)
          .setFooter("Message ID: " + message.id)
          .setTimestamp();

        //send embed
        logger
          .send({
            embed: logsmessage,
          })
          .catch((error) =>
            //error
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

    //send warning message
    return message.channel.send(
      `${user} has been warned!\nYou have ${userscore.warning} warning(s)`
    );
  },
};
