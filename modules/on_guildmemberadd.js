npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onGuildMemberAdd: async function (guildMember) {
    //ignore bots
    if (guildMember.user.bot) return;
    //load shit

    const guildChannels = getGuild.get(guildMember.guild.id);
    if (guildChannels) {
      var thisguild = guildMember.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var generalChannel1 = guildMember.client.channels.cache.get(
        guildChannels.generalChannel
      );
      if (!generalChannel1) {
        var generalChannel1 = "0";
      }
      var muteChannel1 = guildMember.client.channels.cache.get(
        guildChannels.muteChannel
      );
      if (!muteChannel1) {
        var muteChannel1 = "0";
      }
      var logsChannel1 = guildMember.client.channels.cache.get(
        guildChannels.logsChannel
      );
      if (!logsChannel1) {
        var logsChannel1 = "0";
      }
    } else {
      var generalChannel1 = "0";
      var muteChannel1 = "0";
      var logsChannel1 = "0";
    }
    if (guildMember.guild.id == "628978428019736619") {
      rolearray = [
        "674208095626592266",
        "674208167437139979",
        "674207678347608064",
        "674207950822440970",
      ];
      for (let i of rolearray) {
        let role = guildMember.guild.roles.cache.find((r) => r.id === `${i}`);
        guildMember.roles.add(role);
      }
    }
    //account age check
    let roleadd1 = guildMember.guild.roles.cache.find((r) => r.name === "~/Members");
    let user = guildMember.user;
    let userscore2 = getScore.get(user.id, guildMember.guild.id);
    if (!userscore2) {
      userscore2 = {
        id: `${guildMember.guild.id}-${user.id}`,
        user: user.id,
        guild: guildMember.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };
      setScore.run(userscore2);
    } else {
      if (userscore2.muted == "1") {
        if (muteChannel1 == "0") {
        } else {
          let count = "0";
          let array = [];
          guildMember.client.channels.cache
            .filter((channel) => channel.guild.id === guildMember.guild.id)
            .map((channels) => array.push(channels.id));
          for (let i of array) {
            count++;
            setTimeout(() => {
              let channel = guildMember.guild.channels.cache.find(
                (channel) => channel.id === i
              );
              if (channel) {
                if (muteChannel1) {
                  if (i !== muteChannel1.id) {
                    channel.overwritePermissions(user, {
                      VIEW_CHANNEL: false,
                      READ_MESSAGES: false,
                      SEND_MESSAGES: false,
                      READ_MESSAGE_HISTORY: false,
                      ADD_REACTIONS: false,
                    });
                  }
                  let channel2 = guildMember.guild.channels.cache.find(
                    (channel) => channel.id === muteChannel1.id
                  );
                  channel2.overwritePermissions(user, {
                    VIEW_CHANNEL: true,
                    READ_MESSAGES: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: false,
                  });
                }
              }
            }, 200 * count);
          }
          return muteChannel1.send(
            `${user}` +
              ", You have been muted by our system due to breaking rules, trying to leave and rejoin will not work!"
          );
        }
      }
    }
    var cdate = moment.utc(user.createdAt).format("YYYYMMDD");
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");
    //logs
    if (logsChannel1 == `0`) {
    } else {
      try {
        const embed = new Discord.MessageEmbed()
          .setTitle(`User joined`)
          .setColor(`RANDOM`)
          .setDescription(`${guildMember.user}`)
          .addField(
            `This user has joined us.`,
            "\n" +
              guildMember.user.username +
              "\n" +
              guildMember.user.id +
              "\nAccount age: " +
              ageA.join(" ")
          )
          .setTimestamp();
        logsChannel1.send({
          embed,
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
    if (muteChannel1 == `0`) {
    } else {
      let array = [];
      guildMember.client.channels.cache
        .filter((channel) => channel.guild.id === guildMember.guild.id)
        .map((channels) => array.push(channels.id));
      let count = "0";
      for (let i of array) {
        count++;
        setTimeout(() => {
          let channel = guildMember.guild.channels.cache.find(
            (channel) => channel.id === i
          );
          if (channel) {
            if (muteChannel1) {
              if (i !== muteChannel1.id) {
                channel.overwritePermissions(user, {
                  VIEW_CHANNEL: false,
                  READ_MESSAGES: false,
                  SEND_MESSAGES: false,
                  READ_MESSAGE_HISTORY: false,
                  ADD_REACTIONS: false,
                });
              }
              let channel2 = guildMember.guild.channels.cache.find(
                (channel) => channel.id === muteChannel1.id
              );
              channel2.overwritePermissions(user, {
                VIEW_CHANNEL: true,
                READ_MESSAGES: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                ATTACH_FILES: false,
              });
            }
          }
        }, 200 * count);
      }
      //if Anti raid is on
      if (guildChannels.autoMod == "strict") {
        try {
          return muteChannel1.send(
            ageA.join(" ") +
              " " +
              `${guildMember.user}` +
              "\nAutomod Strict is on!\nThis means that every user gets dumped into this channel.\nAutomod strict is usually enabled if there is a raid going on."
          );
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
      //if there is a mute channel
      const prefixstart = getGuild.get(guildMember.guild.id);
      const prefix = prefixstart.prefix;
      return muteChannel1.send(
        ageA.join(" ") +
          " " +
          `${guildMember.user}` +
          "\nWelcome, you need to verify yourself first!\nTo begin write `" +
          prefix +
          "verify`"
      );
    }
    //make nice image for welcoming
    if (roleadd1) {
      guildMember.roles.add(roleadd1).catch(console.error);
    }
    if (generalChannel1 == "0") {
    } else {
      try {
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage("./modules/img/mintwelcome.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = "30px Zelda";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(
          guildMember.user.username,
          canvas.width / 3.0,
          canvas.height / 2.0
        );
        ctx.font = "21px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          "\nAccount age: " + ageA.join(" ") + "\nID: " + guildMember.id,
          canvas.width / 3.0,
          canvas.height / 2.0
        );
        const avatar = await Canvas.loadImage(
          guildMember.user.displayAvatarURL({ format: 'jpg' })
        );
        ctx.drawImage(avatar, 600, 25, 50, 50);
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const guildlogo = await Canvas.loadImage(guildMember.guild.iconURL({ format: 'jpg' }));
        ctx.drawImage(guildlogo, 25, 25, 200, 200);
        const attachment = new Discord.MessageAttachment(
          canvas.toBuffer(),
          "welcome-image.png"
        );
        await generalChannel1.send(attachment);
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
  },
};
