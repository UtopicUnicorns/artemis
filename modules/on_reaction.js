//load modules
npm = require("./NPM.js");
npm.npm();

//initiate database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onReaction: async function (reaction, user) {
    //load guildchannels
    const guildChannels = getGuild.get(reaction.message.guild.id);

    //if guild channels
    if (guildChannels)
      var thisguild = reaction.message.client.guilds.cache.get(
        guildChannels.guild
      );

    //if guild exists
    if (thisguild) {
      //define logs
      var logsChannel1 = reaction.message.client.channels.cache.get(
        guildChannels.logsChannel
      );

      //define highlight
      var highlightChannel1 = reaction.message.client.channels.cache.get(
        guildChannels.highlightChannel
      );

      //define reaction roles
      var reactionChannel1 = reaction.message.client.channels.cache.get(
        guildChannels.reactionChannel
      );

      //if guild is FAKE
    } else {
      //define channels to 0
      var logsChannel1 = "0";
      var highlightChannel1 = "0";
      var reactionChannel1 = "0";
    }

    //if there is a logs channel
    if (!logsChannel1 == "0") {
      //report module
      //How many reactions does it need
      let limit1 = 1;

      //if emote is \uD83D\uDEAB and limit reached
      if (reaction.emoji.name == "\uD83D\uDEAB" && reaction.count == limit1) {
        //if author is Artemis piss off
        if (reaction.message.author.id == "440892659264126997") return;

        //if reaction is from user itself, fuck off and remove emote
        if (reaction.users.first() == reaction.message.author)
          return reaction.remove(reaction.message.author.id);

        //if no attachments
        if (!reaction.message.attachments.size > 0) {
          try {
            //form embed
            const editmessage = new Discord.MessageEmbed()
              .setTitle("A message got reported!")
              .setAuthor(
                reaction.message.author.username,
                reaction.message.author.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                })
              )
              .setDescription("Message by: " + reaction.message.author)
              .setURL(reaction.message.url)
              .setColor("RANDOM")
              .addField("Reported Message:\n", reaction.message.content, true)
              .addField("Channel", reaction.message.channel, true)
              .addField("Reported by: ", reaction.users.first())
              .addField("Raw link: ", reaction.message.url)
              .setFooter("Message ID: " + reaction.message.id)
              .setTimestamp();

            //send embed
            return logsChannel1.send({
              embed: editmessage,
            });
          } catch {
            //on error
            console.log(
              moment().format("MMMM Do YYYY, HH:mm:ss") +
                "\n" +
                __filename +
                ":" +
                ln()
            );
          }
        }

        //if no message but attachment
        if (reaction.message.content === "") {
          try {
            //form embed
            const image = reaction.message.attachments.array()[0].url;
            const editmessage = new Discord.MessageEmbed()
              .setTitle("A message got reported!")
              .setAuthor(
                reaction.message.author.username,
                reaction.message.author.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                })
              )
              .setDescription("Message by: " + reaction.message.author)
              .setURL(reaction.message.url)
              .setColor("RANDOM")
              .addField("Channel", reaction.message.channel, true)
              .addField("Reported by: ", reaction.users.first())
              .addField("Raw link: ", reaction.message.url)
              .setFooter("Message ID: " + reaction.message.id)
              .setImage(image)
              .setTimestamp();

            //send embed
            return logsChannel1.send({
              embed: editmessage,
            });
          } catch {
            //on error
            console.log(
              moment().format("MMMM Do YYYY, HH:mm:ss") +
                "\n" +
                __filename +
                ":" +
                ln()
            );
          }
        }

        //if message and attachments
        try {
          //form embed
          const image = reaction.message.attachments.array()[0].url;
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message got reported!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setDescription("Message by: " + reaction.message.author)
            .setURL(reaction.message.url)
            .setColor("RANDOM")
            .addField("Reported Message:\n", reaction.message.content, true)
            .addField("Raw link: ", reaction.message.url)
            .addField("Reported by: ", reaction.users.first())
            .addField("Channel", reaction.message.channel, true)
            .setFooter("Message ID: " + reaction.message.id)
            .setImage(image)
            .setTimestamp();

          //send embed
          return logsChannel1.send({
            embed: editmessage,
          });
        } catch {
          //on error
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }

      //reportdelete Module
      //treshold
      let limit2 = 3;

      //if emote is \uD83D\uDEAB and treshold is made
      if (reaction.emoji.name == "\uD83D\uDEAB" && reaction.count == limit2) {
        try {
          //if user is me, artemis or self
          if (reaction.message.author.id == "440892659264126997") return;
          if (reaction.message.author.id == "127708549118689280") return;
          if (reaction.users.first() == reaction.message.author)
            return reaction.remove(reaction.message.author.id);

          //remove reported message
          reaction.message.delete();

          //if no content
          if (reaction.message.content === "") return;

          //form embed
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message that was reported got deleted!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setDescription("Message by: " + reaction.message.author)
            .setColor("RANDOM")
            .addField("Reported Message:\n", reaction.message.content, true)
            .addField("Deleted by: ", reaction.users.last())
            .addField("Channel", reaction.message.channel, true)
            .addField("Raw link: ", reaction.message.url)
            .setFooter("Message ID: " + reaction.message.id)
            .setTimestamp();

          //send embed
          return logsChannel1.send({
            embed: editmessage,
          });
        } catch {
          //on error
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
    }

    //Highlights module
    //new treshold
    let limit = 3;

    //if limit is reached and emoji
    if (reaction.emoji.name == "🍵" && reaction.count == limit) {
      //if not highlight channel
      if (highlightChannel1 == "0")
        return reaction.message.channel.send(
          "You did not set up a Highlights channel!"
        );

      //if author is Artemis
      if (reaction.message.author.id == "440892659264126997") return;

      //if no attachments
      if (!reaction.message.attachments.size > 0) {
        try {
          //form embed
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message got highlighted!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .attachFiles(["./modules/img/tea.png"])
            .setThumbnail("attachment://tea.png")
            .setDescription("Message by: " + reaction.message.author)
            .setURL(reaction.message.url)
            .setColor("RANDOM")
            .addField("Mintiest Message:\n", reaction.message.content, true)
            .addField("Channel", reaction.message.channel, true)
            .addField("Raw link: ", reaction.message.url)
            .setFooter("Message ID: " + reaction.message.id)
            .setTimestamp();

          //send embed
          return highlightChannel1.send({
            embed: editmessage,
          });
        } catch {
          //on error
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }

      //if no message bit attachment
      if (reaction.message.content === "") {
        try {
          //for embed
          const image = reaction.message.attachments.array()[0].url;
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message got highlighted!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .attachFiles(["./modules/img/tea.png"])
            .setThumbnail("attachment://tea.png")
            .setDescription("Message by: " + reaction.message.author)
            .setURL(reaction.message.url)
            .setColor("RANDOM")
            .addField("Channel", reaction.message.channel, true)
            .addField("Raw link: ", reaction.message.url)
            .setFooter("Message ID: " + reaction.message.id)
            .setImage(image)
            .setTimestamp();

          //send embed
          return highlightChannel1.send({
            embed: editmessage,
          });
        } catch {
          //on error
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }

      //if message and attachment
      try {
        //form embed
        const image = reaction.message.attachments.array()[0].url;
        const editmessage = new Discord.MessageEmbed()
          .setTitle("A message got highlighted!")
          .setAuthor(
            reaction.message.author.username,
            reaction.message.author.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .attachFiles(["./modules/img/tea.png"])
          .setThumbnail("attachment://tea.png")
          .setDescription("Message by: " + reaction.message.author)
          .setURL(reaction.message.url)
          .setColor("RANDOM")
          .addField("Mintiest Message:\n", reaction.message.content, true)
          .addField("Channel", reaction.message.channel, true)
          .addField("Raw link: ", reaction.message.url)
          .setFooter("Message ID: " + reaction.message.id)
          .setImage(image)
          .setTimestamp();

        //send embed
        return highlightChannel1.send({
          embed: editmessage,
        });
      } catch {
        //on error
        console.log(
          moment().format("MMMM Do YYYY, HH:mm:ss") +
            "\n" +
            __filename +
            ":" +
            ln()
        );
      }
    }

    //reaction roles module
    //if there is a roles channel
    if (!reactionChannel1 == "0") {
      //if in the roles channel
      if (reaction.message.channel.id === reactionChannel1.id) {
        //if not user
        if (!user) return;

        //if bot
        if (user.bot) return;

        //if no guild
        if (!reaction.message.channel.guild) return;

        //pull role data
        const allroles = db
          .prepare("SELECT * FROM roles WHERE guild = ?;")
          .all(reaction.message.guild.id);

        //empty array
        let array2 = [];

        //loop trough allroles
        for (const data of allroles) {
          try {
            //push roles into array
            array2.push(
              reaction.message.guild.roles.cache.find((r) => r.id == data.roles)
                .name
            );
          } catch {
            //on error
            console.log("");
          }
        }

        //loop trough new array
        for (let n in array2) {
          //if emoji name is in the array
          if (reaction.emoji.name == array2[n]) {
            //form role
            const role = reaction.message.guild.roles.cache.find(
              (r) => r.name == array2[n]
            );

            //form user
            const guildMember = reaction.message.guild.members.cache.get(
              user.id
            );

            //check if user has role
            let haverole = guildMember.roles.cache.find(
              (r) => r.id === role.id
            );

            //if user does not have role
            if (!haverole) {
              //add role
              guildMember.roles.add(role).catch(console.error);

              //remove reaction
              reaction.users.remove(user.id);

              //form embed
              const embed = new Discord.MessageEmbed()
                .setAuthor(
                  user.username,
                  user.avatarURL({ format: "png", dynamic: true, size: 1024 })
                )
                .setColor("RANDOM")
                .addField("Joined: ", role, true)
                .setTimestamp();

              //send embed, delete embed after 5 seconds
              reaction.message.client.channels.cache
                .get(reactionChannel1.id)
                .send(embed)
                .then((message) => {
                  message.delete({
                    timeout: 5000,
                    reason: "It had to be done.",
                  });
                });

              //if user does have role
            } else {
              //remove role
              guildMember.roles.remove(role).catch(console.error);

              //remove reaction
              reaction.users.remove(user.id);

              //form embed
              const embed = new Discord.MessageEmbed()
                .setAuthor(
                  user.username,
                  user.avatarURL({ format: "png", dynamic: true, size: 1024 })
                )
                .setColor("RANDOM")
                .addField("Left: ", role, true)
                .setTimestamp();

              //send embed and remove after 5 seconds
              reaction.message.client.channels.cache
                .get(reactionChannel1.id)
                .send(embed)
                .then((message) => {
                  message.delete({
                    timeout: 5000,
                    reason: "It had to be done.",
                  });
                });
            }
          }
        }
      }
    }
  },
};
