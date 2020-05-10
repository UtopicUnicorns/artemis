npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onReaction: async function (reaction, user) {
    //load shit
    const guildChannels = getGuild.get(reaction.message.guild.id);
    if (guildChannels) {
      var thisguild = reaction.message.client.guilds.cache.get(
        guildChannels.guild
      );
    }
    if (thisguild) {
      var logsChannel1 = reaction.message.client.channels.cache.get(
        guildChannels.logsChannel
      );
      var highlightChannel1 = reaction.message.client.channels.cache.get(
        guildChannels.highlightChannel
      );
      var reactionChannel1 = reaction.message.client.channels.cache.get(
        guildChannels.reactionChannel
      );
    } else {
      var logsChannel1 = "0";
      var highlightChannel1 = "0";
      var reactionChannel1 = "0";
    }
    if (!logsChannel1 == "0") {
      //report
      let limit1 = 1;
      if (reaction.emoji.name == "\uD83D\uDEAB" && reaction.count == limit1) {
        if (reaction.message.author.id == "440892659264126997") return;
        if (reaction.users.first() == reaction.message.author)
          return reaction.remove(reaction.message.author.id);
        if (!reaction.message.attachments.size > 0) {
          try {
            const editmessage = new Discord.MessageEmbed()
              .setTitle("A message got reported!")
              .setAuthor(
                reaction.message.author.username,
                reaction.message.author.avatarURL({ format: "jpg" })
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
            return logsChannel1.send({
              embed: editmessage,
            });
          } catch {
            console.log(
              moment().format("MMMM Do YYYY, HH:mm:ss") +
                "\n" +
                __filename +
                ":" +
                ln()
            );
          }
        }
        if (reaction.message.content === "") {
          try {
            const image = reaction.message.attachments.array()[0].url;
            const editmessage = new Discord.MessageEmbed()
              .setTitle("A message got reported!")
              .setAuthor(
                reaction.message.author.username,
                reaction.message.author.avatarURL({ format: "jpg" })
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
            return logsChannel1.send({
              embed: editmessage,
            });
          } catch {
            console.log(
              moment().format("MMMM Do YYYY, HH:mm:ss") +
                "\n" +
                __filename +
                ":" +
                ln()
            );
          }
        }
        try {
          const image = reaction.message.attachments.array()[0].url;
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message got reported!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({ format: "jpg" })
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
          return logsChannel1.send({
            embed: editmessage,
          });
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
      //reportdelete
      let limit2 = 3;
      if (reaction.emoji.name == "\uD83D\uDEAB" && reaction.count == limit2) {
        try {
          if (reaction.message.author.id == "440892659264126997") return;
          if (reaction.message.author.id == "127708549118689280") return;
          if (reaction.users.first() == reaction.message.author)
            return reaction.remove(reaction.message.author.id);
          reaction.message.delete();
          if (reaction.message.content === "") return;
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message that was reported got deleted!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({ format: "jpg" })
            )
            .setDescription("Message by: " + reaction.message.author)
            .setColor("RANDOM")
            .addField("Reported Message:\n", reaction.message.content, true)
            .addField("Deleted by: ", reaction.users.last())
            .addField("Channel", reaction.message.channel, true)
            .addField("Raw link: ", reaction.message.url)
            .setFooter("Message ID: " + reaction.message.id)
            .setTimestamp();
          return logsChannel1.send({
            embed: editmessage,
          });
        } catch {
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
    //Highlights
    let limit = 3;
    if (reaction.emoji.name == "🍵" && reaction.count == limit) {
      if (highlightChannel1 == "0")
        return reaction.message.channel.send(
          "You did not set up a Highlights channel!"
        );
      if (reaction.message.author.id == "440892659264126997") return;
      if (!reaction.message.attachments.size > 0) {
        try {
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message got highlighted!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({ format: "jpg" })
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
          return highlightChannel1.send({
            embed: editmessage,
          });
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
      if (reaction.message.content === "") {
        if (highlightChannel1 == "0")
          return reaction.message.channel.send(
            "You did not set up a logs channel!"
          );
        try {
          const image = reaction.message.attachments.array()[0].url;
          const editmessage = new Discord.MessageEmbed()
            .setTitle("A message got highlighted!")
            .setAuthor(
              reaction.message.author.username,
              reaction.message.author.avatarURL({ format: "jpg" })
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
          return highlightChannel1.send({
            embed: editmessage,
          });
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
      }
      if (highlightChannel1 == "0")
        return reaction.message.channel.send(
          "You did not set up a logs channel!"
        );
      try {
        const image = reaction.message.attachments.array()[0].url;
        const editmessage = new Discord.MessageEmbed()
          .setTitle("A message got highlighted!")
          .setAuthor(
            reaction.message.author.username,
            reaction.message.author.avatarURL({ format: "jpg" })
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
        return highlightChannel1.send({
          embed: editmessage,
        });
      } catch {
        console.log(
          moment().format("MMMM Do YYYY, HH:mm:ss") +
            "\n" +
            __filename +
            ":" +
            ln()
        );
      }
    }
    //reaction roles
    if (!reactionChannel1 == "0") {
      if (reaction.message.channel.id === reactionChannel1.id) {
        if (!user) return;
        if (user.bot) return;
        if (!reaction.message.channel.guild) return;
        const allroles = db
          .prepare("SELECT * FROM roles WHERE guild = ?;")
          .all(reaction.message.guild.id);
        let array2 = [];
        for (const data of allroles) {
          try {
            array2.push(
              reaction.message.guild.roles.cache.find((r) => r.id == data.roles)
                .name
            );
          } catch {
            console.log();
          }
        }
        for (let n in array2) {
          if (reaction.emoji.name == array2[n]) {
            const role = reaction.message.guild.roles.cache.find(
              (r) => r.name == array2[n]
            );
            const guildMember = reaction.message.guild.members.cache.get(
              user.id
            );
            let haverole = guildMember.roles.has(role.id);
            if (!haverole) {
              guildMember.roles.add(role).catch(console.error);
              reaction.remove(user.id);
              const embed = new Discord.MessageEmbed()
                .setAuthor(user.username, user.avatarURL({ format: "jpg" }))
                .setColor("RANDOM")
                .addField("Joined: ", role, true)
                .setTimestamp();
              reaction.message.client.channels
                .get(reactionChannel1.id)
                .send(embed)
                .then((message) => {
                  message.delete(5000);
                });
            } else {
              guildMember.roles.remove(role).catch(console.error);
              reaction.remove(user.id);
              const embed = new Discord.MessageEmbed()
                .setAuthor(user.username, user.avatarURL({ format: "jpg" }))
                .setColor("RANDOM")
                .addField("Left: ", role, true)
                .setTimestamp();
              reaction.message.client.channels
                .get(reactionChannel1.id)
                .send(embed)
                .then((message) => {
                  message.delete(5000);
                });
            }
          }
        }
      }
    }
  },
};
