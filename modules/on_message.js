//load modules
npm = require("./NPM.js");
npm.npm();

//load databases
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMessage: async function (message) {
    //Disboard
    if (message.author.id == "302050872383242240") {
      if (message.embeds[0].description.includes("Bump done")) {
        let guildChannels2 = getGuild.get(message.guild.id);
        if (guildChannels2) {
          if (guildChannels2.leveling == "2") {
            message.channel.messages.fetch().then((messages) => {
              let dbumper = messages
                .filter((msg) =>
                  msg.content.toLowerCase().startsWith("!d bump")
                )
                .map((msg) => msg.author.id);
              message.channel.send(
                "You bumped!\nand we will ping you in 2 hours for your next bump.\n<@" +
                  dbumper[0] +
                  ">"
              );
              let settime = 7200000;
              let remindtext = "Time for your next `!d bump`";
              let datefor = moment()
                .add(settime, "ms")
                .format("YYYYMMDDHHmmss");
              timerset = {
                mid: message.id,
                cid: message.channel.id,
                gid: message.guild.id,
                uid: dbumper[0],
                time: datefor,
                reminder: remindtext,
              };
              setRemind.run(timerset);
            });
          } else {
            message.channel.messages.fetch().then((messages) => {
              let dbumper = messages
                .filter((msg) =>
                  msg.content.toLowerCase().startsWith("!d bump")
                )
                .map((msg) => msg.author.id);
              message.channel.send(
                "You bumped!\nThis action gave you 20 points, and we will ping you in 2 hours for your next bump.\n<@" +
                  dbumper[0] +
                  ">"
              );
              const pointsToAdd = parseInt(20, 10);
              let userscore = getScore.get(dbumper[0], message.guild.id);
              if (!userscore) return;
              userscore.points += pointsToAdd;
              let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
              userscore.level = userLevel;
              setScore.run(userscore);
              //
              let settime = 7200000;
              let remindtext = "Time for your next `!d bump`";
              let datefor = moment()
                .add(settime, "ms")
                .format("YYYYMMDDHHmmss");
              timerset = {
                mid: message.id,
                cid: message.channel.id,
                gid: message.guild.id,
                uid: dbumper[0],
                time: datefor,
                reminder: remindtext,
              };
              setRemind.run(timerset);
            });
          }
        }
      }
    }

    //ignore bots
    if (message.author.bot) return;

    //Direct Message handle
    if (message.channel.type == "dm") {
      console.log(
        moment().format("MMMM Do YYYY, HH:mm:ss") +
          "\n" +
          message.author.username +
          "\n" +
          message.content
      );
      const whoartemis = new Discord.MessageEmbed()
        .setTitle("Invite")
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor("RANDOM")
        .setDescription("Hello, I am Artemis!")
        .addField("Main discord server: ", "https://discord.gg/EVVtPpw")
        .addField("Bot Website: ", "https://artemisbot.eu")
        .addField("Bot Github: ", "https://github.com/UtopicUnicorns/artemis")
        .addField(
          "Bot Invite: ",
          "https://discordapp.com/api/oauth2/authorize?client_id=440892659264126997&permissions=2147483127&scope=bot"
        )
        .setFooter("Bot owner: <@127708549118689280> | UtopicUnicorn#0383");
      return message.channel.send({
        embed: whoartemis,
      });
    }

    //userfailsafe db
    userfailsafe = getScore.get(message.author.id, message.guild.id);
    if (!userfailsafe) {
      userfailsafe = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };
      setScore.run(userfailsafe);
    }

    //Guild safe db
    guildfailsafe = getGuild.get(message.guild.id);
    if (!guildfailsafe) {
      guildfailsafe = {
        guild: message.guild.id,
        generalChannel: `0`,
        highlightChannel: `0`,
        muteChannel: `0`,
        logsChannel: `0`,
        streamChannel: `0`,
        reactionChannel: `0`,
        streamHere: `0`,
        autoMod: `0`,
        prefix: `!`,
        leveling: `1`,
      };
      setGuild.run(guildfailsafe);
    }

    //Level failsafe db
    newLevel = getLevel.get(message.guild.id);
    if (!newLevel) {
      newLevel = {
        guild: message.guild.id,
        lvl5: `0`,
        lvl10: `0`,
        lvl15: `0`,
        lvl20: `0`,
        lvl30: `0`,
        lvl50: `0`,
        lvl85: `0`,
      };
      setLevel.run(newLevel);
    }

    //load channels from database
    const guildChannels = getGuild.get(message.guild.id);
    if (guildChannels) {
      var thisguild = message.client.guilds.cache.get(guildChannels.guild);
    }
    if (thisguild) {
      var generalChannel1 = message.guild.channels.cache.get(
        guildChannels.generalChannel
      );
      if (!generalChannel1) {
        var generalChannel1 = "0";
      }
      var muteChannel1 = message.guild.channels.cache.get(guildChannels.muteChannel);
      if (!muteChannel1) {
        var muteChannel1 = "0";
      }
      var logsChannel1 = message.guild.channels.cache.get(guildChannels.logsChannel);
      if (!logsChannel1) {
        var logsChannel1 = "0";
      }
    } else {
      var generalChannel1 = "0";
      var muteChannel1 = "0";
      var logsChannel1 = "0";
    }

    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //build args
    const args = message.content.slice(prefix.length).split(/ +/);

    //define commands
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);

    //support channel stuff
    let supportID = getSupport.get(message.channel.id, message.guild.id);
    if (supportID) {
      let nameSup = message.guild.channels.cache.find(
        (channel) => channel.id === message.channel.id
      );
      let cCname = nameSup.name;
      let eCname = "\u231B";
      if (nameSup.name.startsWith("\u231B")) {
        if (message.content.toLowerCase() == "done") {
          let changeC = message.channel.name;
          let changeCC = changeC.split("");
          let changeCCC = changeCC.slice(1);
          message.channel.setName(changeCCC.join());
          return message.reply("Wrapping this up, we are done here!");
        }
      } else {
        if (message.content.toLowerCase() == "help") {
          message.channel.setName(`${eCname}` + cCname);
          return message.reply("You have started a support session!");
        }
      }
    }

    //non-prefix help
    if (
      message.mentions.has(message.client.user) &&
      message.content.toLowerCase().includes("help")
    ) {
      const nonprefix = new Discord.MessageEmbed()
        .setTitle("Non prefix help menu")
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(
          "This message was triggered by mentioning me with the help argument"
        )
        .setColor("RANDOM")
        .addField("My prefix for this server:\n", prefix)
        .addField("Example command usage: \n", prefix + "help")
        .addField(
          "Support my work: ",
          "https://www.patreon.com/utopicunicorn\nhttps://artemisbot.eu"
        )
        .setTimestamp();
      message.channel.send({
        embed: nonprefix,
      });
    }

    //autoMod START
    if (message.member && message.member.permissions.has("KICK_MEMBERS")) {
    } else {
      if (guildChannels.autoMod == "strict" || guildChannels.autoMod == "2") {
        const automod = require("./automod.js");
        automod.automod("wordFilter", message);
        automod.automod("noSpam", message);
        automod.automod("noInvites", message);
        automod.automod("antiMention", message);
      }
    }

    //Mute filter
    if (muteChannel1 == "0") {
    } else {
      if (message.channel.id === muteChannel1.id) {
        function verifyHuman(message) {
          let captcha = new Captcha2();
          const attachment = new Discord.MessageAttachment(
            captcha.PNGStream,
            "captcha.png"
          );
          message.reply(
            "**Enter the text shown in the image below:**\nIf you fail the verifications just do " +
              prefix +
              "verify again!\nIf you're blind or visually disabled then ping an admin.",
            attachment
          );
          let collector = message.channel.createMessageCollector(
            (m) => m.author.id === message.author.id
          );
          collector.on("collect", async (m) => {
            if (m.content.toUpperCase() === captcha.value) {
              if (guildChannels.autoMod == "strict") {
                return message.reply(
                  "Our sincere apologies, Automod Strict is ON\nWhich means that people have to be manually approved!"
                );
              } else {
                let userscore1 = getScore.get(
                  message.author.id,
                  message.guild.id
                );
                if (!userscore1) {
                } else {
                  if (userscore1.muted == "1")
                    return message.reply(
                      "You have been muted by our system due to breaking rules, the verification system is not for you!"
                    );
                }
                let roleadd = message.guild.roles.cache.find(
                  (r) => r.name === "~/Members"
                );
                let member = message.author;
                var cdate = moment.utc(member.createdAt).format("YYYYMMDD");
                let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
                let ageA = ageS.split(" ");
                if (roleadd) {
                  setTimeout(async () => {
                    await message.member.roles.add(roleadd).catch(console.error);
                  }, 5000);
                }
                const canvas = Canvas.createCanvas(700, 250);
                const ctx = canvas.getContext("2d");
                const background = await Canvas.loadImage("./modules/img/mintwelcome.png");
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.font = "30px Zelda";
                ctx.shadowColor = "black";
                ctx.shadowBlur = 5;
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(
                  member.username,
                  canvas.width / 3.0,
                  canvas.height / 2.0
                );
                ctx.font = "21px sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.fillText(
                  "\nAccount age: " + ageA.join(" ") + "\nID: " + member.id,
                  canvas.width / 3.0,
                  canvas.height / 2.0
                );
                const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'jpg' }));
                ctx.drawImage(avatar, 600, 25, 50, 50);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const guildlogo = await Canvas.loadImage(message.guild.iconURL({ format: 'jpg' }));
                ctx.drawImage(guildlogo, 25, 25, 200, 200);
                const attachment = new Discord.MessageAttachment(
                  canvas.toBuffer(),
                  "welcome-image.png"
                );
                await generalChannel1.send(attachment);
                setTimeout(() => {
                  let array2 = [];
                  message.client.channels.cache
                    .filter((channel) => channel.guild.id === message.guild.id)
                    .map((channels) => array2.push(channels.id));
                  for (let i of array2) {
                    setTimeout(() => {
                      let channel = message.guild.channels.cache.find(
                        (channel) => channel.id === i
                      );
                      if (channel) {
                        if (channel.permissionOverwrites.get(member.id)) {
                          channel.permissionOverwrites.get(member.id).delete();
                        }
                      }
                    }, 200);
                  }
                }, 2000);
                return message.channel.send(`${member} has been approved.`);
              }
            } else message.channel.send("Failed Verification!");
            collector.stop();
          });
        }
        if (message.content == prefix + "verify") {
          verifyHuman(message);
        }
      }
    }

    //Topic For mint server only
    if (message.guild.id == "628978428019736619") {
      if (message.member && message.member.permissions.has("KICK_MEMBERS")) {
        if (message.content.startsWith(prefix + "topic")) {
          let selectthis = [
            "Which Linux distribution did you first user,\nand why did you start using it?",
            "Do you have a favourite Linux/UNIX command?\nUse `" +
              prefix +
              "man command` to know what a command does, never use commands you do not know.",
            "Are you currently dual booting another OS or distribution,\nwhy do you dual boot, or why do you not?",
            "Do you know any programming languages,\nand which one is your favourite?",
            "Which games do you usually play,\nand are they available on Linux?",
            "Do you have any safety tips for others to know regarding the Corona virus?",
            "What made you interested in Linux Mint?",
          ];
          let selectedthis = selectthis[~~(Math.random() * selectthis.length)];
          message.client.channels
            .get("695182849476657223")
            .setTopic(selectedthis);
          const topicstart = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor("RANDOM")
            .setDescription(
              "For the next 30 minutes this will be the topic!\nTrying to go off-topic may have consequences."
            )
            .addField(
              "The topic that I have selected for you is: \n",
              selectedthis
            )
            .setFooter("Behave properly, and respect each others opinions.\n")
            .setTimestamp();
          message.channel.send({
            embed: topicstart,
          });
        }
      }
    }

    //Secret adult role
    if (message.guild.id == "628978428019736619") {
      let amember = message.guild.members.cache.get(message.author.id);
      if (
        message.content
          .toLowerCase()
          .startsWith("i want to enter the dark side, i accept the risk") &&
        amember.roles.has("629020299261902889")
      ) {
        let haverole = amember.roles.has("701396956009857083");
        if (haverole) {
          return message.reply("You already have access to the dark side!");
        } else {
          let arole = message.guild.roles.cache.find(
            (r) => r.id == "701396956009857083"
          );
          amember.roles.add(arole).catch(console.error);
          return message.reply("You have been granted access!");
        }
      }
    }

    /*   //EVENT
  if (message.guild.id == "628978428019736619") {
    let eventnumber = 25;
    let eventnumber2 = Math.floor(Math.random() * 50);
    if (eventnumber2 == eventnumber) {
      let eventcheck = message.member.roles.find(r => r.name === `512Mb`);
      if (!eventcheck) {
        let eventr = message.guild.roles.cache.find(r => r.name === `512Mb`);
        if (!eventr) return;
        message.member.roles.add(eventr);
        const eventembed = new Discord.MessageEmbed()
          .setTitle("EVENT")
          .setColor("RANDOM")
          .setDescription(
            message.author +
              "\n earned the event title:\n512Mb\nCongratulations!"
          )
          .setTimestamp();
        message.client.channels.cache.get(`628984660298563584`).send({
          embed: eventembed
        });
      }
    }
  } */

    //Artemis Talk
    if (message.channel.id === "642882039372185609") {
      if (message.author.id !== "440892659264126997") {
        let cargs = message.content.slice(5);
        if (message.content.startsWith(prefix + "channel")) {
          let readname = fs
            .readFileSync("channelset.txt")
            .toString()
            .split("\n");
          let channelname = message.client.channels.cache.get(`${readname}`);
          return message.channel.send(channelname.name);
        }
        if (message.content.startsWith(prefix + "set")) {
          fs.writeFile("channelset.txt", cargs, function (err) {
            if (err) throw err;
          });
          return message.channel.send(
            "Set channel id to: " + message.client.channels.cache.get(`${cargs}`)
          );
        }
        let channelcheck = fs
          .readFileSync("channelset.txt")
          .toString()
          .split("\n");
        if (!message.client.channels.cache.get(`${channelcheck}`)) {
          return message.channel.send(
            "Enter a valid channel ID first!\n!set ChannelID"
          );
        }
        try {
          message.client.channels.cache.get(`${channelcheck}`).send(message.content);
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
        return;
      }
    }

    //restart bot
    if (message.content.toLowerCase() == "kill yourself") {
      if (message.author.id === "127708549118689280") {
        message.reply(
          "\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80"
        );
        setTimeout(() => {
          process.exit();
        }, 2000);
      }
    }

    //Simulate guild member join
    if (message.content === prefix + "guildmemberadd") {
      if (
        message.author.id === "127708549118689280" ||
        message.author.id == message.guild.owner.id
      ) {
        message.client.emit(
          "guildMemberAdd",
          message.member || (await message.guild.members.fetch(message.author))
        );
      }
    }

    //Simulate guild member leave
    if (message.content === prefix + "guildmemberremove") {
      if (
        message.author.id === "127708549118689280" ||
        message.author.id == message.guild.owner.id
      ) {
        message.client.emit(
          "guildMemberRemove",
          message.member || (await message.guild.members.fetch(message.author))
        );
      }
    }

    //translate
    //Start db for opt
    translateopt = getScore.get(message.author.id, message.guild.id);
    if (
      translateopt.translate == `2` ||
      message.content.startsWith(prefix + "tr")
    ) {
      //commence translate if opt
      let baseurl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
      let key = configfile.yandex;
      if (message.content.startsWith(prefix + "tr")) {
        var text = message.content.slice(prefix.length + 3);
      } else {
        var text = message.content;
      }
      let url =
        baseurl +
        "?key=" +
        key +
        "&hint=en,de,nl,fr,tr&lang=en" +
        "&text=" +
        encodeURIComponent(text) +
        "&format=plain";
      request(
        url,
        {
          json: true,
        },
        (err, res, body) => {
          if (!body) return;
          if (!body.text) {
            return;
          }
          if (message.content.startsWith(prefix + "tr")) {
          } else {
            if (JSON.stringify(body).startsWith('{"code":200,"lang":"en-en"')) {
              return;
            }
          }
          translate(text, {
            to: "en",
          })
            .then((res) => {
              if (message.content.includes("ãƒ„")) return;
              if (res == message.content) return;
              try {
                const translationtext = new Discord.MessageEmbed()
                  .setAuthor(message.author.username, message.author.avatarURL())
                  .setColor("RANDOM")
                  .setDescription(res)
                  .setFooter("Translated from: " + body.lang)
                  .setTimestamp();
                message.channel.send({
                  embed: translationtext,
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
            })
            .catch((err) => {
              console.log('');
            });
          if (err) return message.channel.send(err);
        }
      );
    }

    //set points
    let score;
    if (message.guild) {
      score = getScore.get(message.author.id, message.guild.id);
      if (
        guildChannels.leveling == "2" ||
        message.author.id == "121723489014120448"
      ) {
      } else {
        score.points++;
        const curLevel = Math.floor(0.5 * Math.sqrt(score.points));
        if (score.level < curLevel) {
          score.level++;
        }
        setScore.run(score);
      }
    }

    //start level rewards
    const levelups = getLevel.get(message.guild.id);
    let levelers = [
      levelups.lvl5,
      levelups.lvl10,
      levelups.lvl15,
      levelups.lvl20,
      levelups.lvl30,
      levelups.lvl50,
      levelups.lvl85,
    ];
    let levelerstxt = ["5", "10", "15", "20", "30", "50", "85", "1000"];
    let count = -1;
    for (let i of levelers) {
      count++;
      if (
        score.level >= levelerstxt[count] &&
        score.level < levelerstxt[count + 1]
      ) {
        const level = message.guild.roles.cache.find((r) => r.id === i);
        if (level) {
          let checking = message.member.roles.find((r) => r.id === i);
          if (!checking) {
            let remove = [
              levelups.lvl5,
              levelups.lvl10,
              levelups.lvl15,
              levelups.lvl20,
              levelups.lvl30,
              levelups.lvl50,
              levelups.lvl85,
            ];
            for (let n of remove) {
              const level2 = message.guild.roles.cache.find((r) => r.id === n);
              if (level2) {
                if (message.member.roles.find((r) => r.id === n)) {
                  message.member.roles.remove(level2).catch((error) => {
                    console.log(
                      moment().format("MMMM Do YYYY, HH:mm:ss") +
                        "\n" +
                        __filename +
                        ":" +
                        ln()
                    );
                  });
                }
              }
            }
            message.member.roles.add(level).catch((error) => {
              console.log(
                moment().format("MMMM Do YYYY, HH:mm:ss") +
                  "\n" +
                  __filename +
                  ":" +
                  ln()
              );
            });
            const embed = new Discord.MessageEmbed()
              .setTitle("Level Role get!")
              .setAuthor(message.author.username, message.author.avatarURL())
              .setColor("RANDOM")
              .addField("Gained the title: ", level, true)
              .setTimestamp();
            message.channel.send(embed);
          }
        }
      }
    }

    //welp ok
    if (guildChannels.leveling == "2") {
    } else {
      //thanks
      if (message.content.toLowerCase().includes("thank")) {
        const user =
          message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (congratulationsRecently.has(message.author.id + message.guild.id)) {
          return;
        } else {
          congratulationsRecently.add(message.author.id) + message.guild.id;
          setTimeout(() => {
            congratulationsRecently.delete(
              message.author.id + message.guild.id
            );
          }, 600000);
          const pointsToAdd = parseInt(20, 10);
          let userscore = getScore.get(user.id, message.guild.id);
          if (!userscore) return;
          userscore.points += pointsToAdd;
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);
          return message.reply(
            "thanked " +
              user.username +
              "\n" +
              user.username +
              " has gotten 20 points for their effort!"
          );
        }
      }

      //love
      if (message.content.toLowerCase().includes("love")) {
        const user =
          message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (congratulationsRecently.has(message.author.id + message.guild.id)) {
          return;
        } else {
          congratulationsRecently.add(message.author.id + message.guild.id);
          setTimeout(() => {
            congratulationsRecently.delete(
              message.author.id + message.guild.id
            );
          }, 600000);
          const pointsToAdd = parseInt(20, 10);
          let userscore = getScore.get(user.id, message.guild.id);
          if (!userscore) return;
          userscore.points += pointsToAdd;
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);
          return message.reply(
            "Gave love to " +
              user.username +
              "\n" +
              user.username +
              " gets 20 points!"
          );
        }
      }

      //Congratulations
      if (message.content.toLowerCase().includes("congrat")) {
        const user =
          message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (congratulationsRecently.has(message.author.id + message.guild.id)) {
          return;
        } else {
          congratulationsRecently.add(message.author.id + message.guild.id);
          setTimeout(() => {
            congratulationsRecently.delete(
              message.author.id + message.guild.id
            );
          }, 600000);
          const pointsToAdd = parseInt(20, 10);
          let userscore = getScore.get(user.id, message.guild.id);
          if (!userscore) return;
          userscore.points += pointsToAdd;
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);
          return message.reply(
            "Congratulated " +
              user.username +
              "\n" +
              user.username +
              " gets 20 points!"
          );
        }
      }
    }

    //require prefix
    if (!message.content.startsWith(prefix)) return;
    //anti command spam fuck you guys
    /* if (supportGet.has(message.author.id + message.guild.id)) {
      return message.reply('Command executed-- wait nope. wait 10 seconds between each command.');
    } else {
      supportGet.add(message.author.id + message.guild.id);
      setTimeout(() => {
        supportGet.delete(message.author.id + message.guild.id);
      }, 10000);
    } */
    try {
      command.execute(message);
    } catch (error) {
      //console.error(error);
    }
  },
};
