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
      var highlightChannel1 = "0";
      var reactionChannel1 = "0";
    }

    //Highlights module
    //set treshold
    let limit = 3;

    //if limit is reached and emoji
    if (reaction.emoji.name == "🍵" && reaction.count == limit) {
      //if not highlight channel
      if (highlightChannel1 == "0")
        return reaction.message.channel.send(
          "You did not set up a Highlights channel!"
        );

      //fetch
      let fetch1 = await reaction.message.client.channels.cache
        .get("654447738070761505")
        .messages.fetch();
      let fetch2 = await fetch1
        .filter((msg) => msg.embeds)
        .map((msg) => msg.embeds[0]);
      if (fetch2[0].footer.text.includes(reaction.message.id)) return;

      //if author is Artemis
      if (reaction.message.author.bot) return;

      //form embed
      const embed = new Discord.MessageEmbed()
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
        .setDescription("Message by: " + `${reaction.message.author}`)
        .setURL(reaction.message.url)
        .setColor("RANDOM")
        .addField("Channel", reaction.message.channel, true)
        .addField("Raw link: ", reaction.message.url)
        .setFooter("Message ID: " + reaction.message.id)
        .setTimestamp();

      //if message
      if (reaction.message.content !== "")
        embed.addField("Mintiest Message:\n", reaction.message.content, true);

      //if image
      if (reaction.message.attachments.size > 0) {
        const image = reaction.message.attachments.array()[0].url;
        embed.setImage(image);
      }

      //reply
      reaction.message.channel.send(
        `Message ${reaction.message.url} has been highligted!\n Check: <#${highlightChannel1.id}>`
      );

      //send embed
      return highlightChannel1.send({
        embed: embed,
      });
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
                  message
                    .delete({
                      timeout: 5000,
                      reason: "It had to be done.",
                    })
                    .catch((err) => console.log(""));
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
                  message
                    .delete({
                      timeout: 5000,
                      reason: "It had to be done.",
                    })
                    .catch((err) => console.log(""));
                });
            }
          }
        }
      }
    }
  },
};
