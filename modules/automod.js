npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  automod: function (autoexec, message) {
    sql = require("better-sqlite3")("./scores.sqlite");
    if (autoexec == "wordFilter") {
      //Word/sentence filter
      let allwords = sql
        .prepare("SELECT * FROM words WHERE guild = ?;")
        .all(message.guild.id);
      let wargs = message.content.toLowerCase().split(" ");
      for (i in wargs) {
        for (const data of allwords) {
          if (wargs.includes(data.words)) {
            return message.delete();
          }
        }
      }
    }
    if (autoexec == "noSpam") {
      //No Spam
      if (spamRecently.has(message.author.id + message.guild.id)) {
        message.delete();
      } else {
        spamRecently.add(message.author.id + message.guild.id);
        setTimeout(() => {
          spamRecently.delete(message.author.id + message.guild.id);
        }, 1000);
      }
    }
    if (autoexec == "noInvites") {
      //No discord invites
      if (
        message.content.toLowerCase().includes("discord.gg/") ||
        message.content.toLowerCase().includes("discordapp.com/invite/")
      ) {
        message.delete();
      }
    }
    if (autoexec == "antiMention") {
      //Anti-mention
      if (message.mentions.users.size > 3) {
        message.delete();
        const guildChannels = getGuild.get(message.guild.id);
        const muteChannel1 = message.guild.channels.cache.get(
          guildChannels.muteChannel
        );
        const member = message.author;
        //
        let userscore = getScore.get(member.id, message.guild.id);
        let array = [];
        message.client.channels.cache
          .filter((channel) => channel.guild.id === message.guild.id)
          .map((channels) => array.push(channels.id));
        for (let i of array) {
          setTimeout(() => {
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
                    member +
                      "\nYou have been muted, because you mentioned too many people at once!"
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
          }, 200);
        }
        if (!userscore) {
          userscore = {
            id: `${message.guild.id}-${member.id}`,
            user: member.id,
            guild: message.guild.id,
            points: 0,
            level: 1,
            warning: 0,
            muted: 1,
            translate: 0,
            stream: 0,
            notes: 0,
          };
        }
        userscore.muted = `1`;
        setScore.run(userscore);

        try {
          message.channel.send(
            member + " has been muted due to spamming mentions"
          );
        } catch {
          message.channel.send(
            member + " has been muted due to spamming mentions!"
          );
        }
        //
      }
    }
  },
};
