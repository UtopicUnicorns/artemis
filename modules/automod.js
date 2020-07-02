//load Modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//sets
spamRecently = new Set();
mentionRecently = new Set();

//start module
module.exports = {
  //function automod
  automod: function (autoexec, message) {
    //define db
    sql = require("better-sqlite3")("./scores.sqlite");

    //if wordfilter
    if (autoexec == "wordFilter") {
      //select all words from db
      let allwords = sql
        .prepare("SELECT * FROM words WHERE guild = ?;")
        .all(message.guild.id);

      //define argumants
      let wargs = message.content.toLowerCase().split(" ");

      //loop trough args
      for (let i of wargs) {
        //loop trough words
        for (const data of allwords) {
          //if message includes a bad word
          if (i.includes(data.words)) {
            //bad Word
            let badWord = i.normalize("NFD");

            //regex
            let regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/;

            //if bad word is regex'd
            if (badWord.match(regex)) {
              //split word
              let word2 = badWord.split(data.words);

              //split entry 0
              var splitF = word2[0][word2[0].length - 1];

              //split entry 1
              var splitL = word2[1].split("");

              //if no F
              if (!splitF) var splitF = "";

              //if no L
              if (!splitL[0]) var splitL = ["", ""];

              //join words
              let wordJoin = splitF + data.words + splitL[0];

              //if it contains regex
              if (wordJoin.match(regex)) return message.delete();
            }

            //if bad word is literally bad word
            if (badWord == data.words) {
              //delete message
              return message.delete();
            }
          }
        }
      }
    }

    //if anti spam
    if (autoexec == "noSpam") {
      //if user messaged in last second
      if (spamRecently.has(message.author.id + message.guild.id)) {
        //delete message
        message.delete();

        //if user is not on list
      } else {
        //add user to list
        spamRecently.add(message.author.id + message.guild.id);

        //delete user from list after half a second
        setTimeout(() => {
          spamRecently.delete(message.author.id + message.guild.id);
        }, 500);
      }
    }

    //if anti invites
    if (autoexec == "noInvites") {
      //if message includes these links
      if (
        message.content.toLowerCase().includes("discord.gg/") ||
        message.content.toLowerCase().includes("discordapp.com/invite/")
      ) {
        //delete message
        message.delete();
      }
    }

    //if anti mention
    if (autoexec == "antiMention") {
      //if there are more than 3 mentions in a single message
      if (message.mentions.users.size > 3) {
        //check if user did this before
        if (mentionRecently.has(message.author.id + message.guild.id)) {
          //delete message
          message.delete();

          //guild channels
          const guildChannels = getGuild.get(message.guild.id);

          //form mute channel
          const muteChannel1 = message.guild.channels.cache.get(
            guildChannels.muteChannel
          );

          //make member
          const member = message.author;

          //pull user data
          let userscore = getScore.get(member.id, message.guild.id);

          //empty array
          let array = [];

          //push guild channels into array
          message.client.channels.cache
            .filter((channel) => channel.guild.id === message.guild.id)
            .map((channels) => array.push(channels.id));

          //loop trough array
          for (let i of array) {
            //discord api spam protect timeout
            setTimeout(() => {
              //check channel
              let channel = message.guild.channels.cache.find(
                (channel) => channel.id === i
              );

              //if it is a channel
              if (channel) {
                //if there is a mute channel
                if (muteChannel1) {
                  //give user access to mute channel
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

                //remove permissions from user from channel
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

          //if no userscore
          if (!userscore) {
            //define user
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

          //mute user
          userscore.muted = `1`;

          //save to db
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

          //if user is not on the list
        } else {
          //add user to list
          mentionRecently.add(message.author.id + message.guild.id);

          //delete user from list after 5 seconds
          setTimeout(() => {
            mentionRecently.delete(message.author.id + message.guild.id);
          }, 5000);
        }
      }
    }
  },
};
