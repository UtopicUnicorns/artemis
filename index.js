//NPM and such
const npm = require("./modules/NPM.js");
npm.npm();

//Shit
const client = new Client();

//load Database
const dbinit = require("./modules/dbinit.js");
dbinit.dbinit();

//Stolen console logger
var originalLog = console.log;
console.log = function (str) {
  originalLog(str);
  if (str) {
    if (str.length > 1500) {
      client.channels.cache.get("701764606053580870").send(str, {
        split: true,
      });
    } else {
      client.channels.cache.get("701764606053580870").send(str);
    }
  }
};

//reddit rss feed
const { FeedEmitter } = require("rss-emitter-ts");
const emitter = new FeedEmitter();

//Dashboard stuff
const oAuth = Discord.OAuth2Application;

//command holder
client.commands = new Discord.Collection();

//command files open
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

//loopdiloop commands and loads em
for (const file of commandFiles) {
  //define command files
  const command = require(`./commands/${file}`);

  //pull database from database
  let usagecheck = getUsage.get(command.name);

  //if command not in db
  if (!usagecheck) {
    usagecheck = {
      command: command.name,
      number: `0`,
    };

    //run database
    setUsage.run(usagecheck);
  }

  //load commands
  client.commands.set(command.name, command);
}

//Bot ready
client.once("ready", () => {
  //look at that a fucking welcome message to the console
  console.log(
    moment().format("MMMM Do YYYY, HH:mm:ss") +
      "\n" +
      __filename +
      ":" +
      ln() +
      `\nBot has started, with ${client.users.cache.size} users.\nI am in ${client.guilds.cache.size} guilds:\n` +
      client.guilds.cache
        .filter((guild) => guild.owner !== undefined)
        .map(
          (guild) => `${guild.id}/${guild.name}\nUsers: ${guild.memberCount}`
        )
        .join("\n\n")
  );

  //change bot Status
  setInterval(() => {
    var RAN = [`https://artemisbot.eu`, `${client.guilds.cache.size} servers`];
    client.user.setActivity(RAN[~~(Math.random() * RAN.length)], {
      type: "LISTENING",
    });
  }, 60000);

  //Wipe music
  const musicf = fs.readdirSync("./music");
  for (const file of musicf) {
    fs.unlink("./music/" + file, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  //Reminder run
  setInterval(() => {
    //pull reminder data
    const remindersdb = db
      .prepare("SELECT * FROM remind ORDER BY time DESC;")
      .all();

    //loop the data
    for (const data of remindersdb) {
      //define time
      let timenow = moment().format("YYYYMMDDHHmmss");

      //if current time is higher than reminder time
      if (timenow > data.time) {
        let gettheguild = client.guilds.cache.get(data.gid);
        if (!gettheguild) return;
        let reminduser = gettheguild.members.cache.get(data.uid);
        if (!reminduser) {
          return db
            .prepare(
              `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
            )
            .run();
        }
        if (
          data.cid == "710893984360169522" ||
          data.cid == "693386614277144646"
        ) {
          //if no channel?
          if (!client.channels.cache.get(data.cid)) {
            return db
              .prepare(
                `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
              )
              .run();
          }

          //notify everyone if this channel
          client.channels.cache.get(data.cid).send("@here");
        } else {
          //if no channel?
          if (!client.channels.cache.get(data.cid)) {
            return db
              .prepare(
                `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
              )
              .run();
          }
          //just notify the user
          client.channels.cache.get(data.cid).send("<@" + data.uid + "> PING!");
        }

        //build embed
        const reminderemb2 = new Discord.MessageEmbed()
          .setTitle("REMIND ALERT")
          .setAuthor(
            reminduser.user.username + "#" + reminduser.user.discriminator,
            reminduser.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setDescription(reminduser)
          .addField("Reminder: ", data.reminder + "!")
          .setColor("RANDOM");

        //send embed
        client.channels.cache.get(data.cid).send({
          embed: reminderemb2,
        });

        //delete entry
        db.prepare(
          `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
        ).run();
      }
    }
  }, 5000);

  //support run
  setInterval(() => {
    const supportDb = db.prepare("SELECT * FROM support").all();
    for (const data of supportDb) {
      if (client.channels.cache.get(data.cid)) {
        if (client.channels.cache.get(data.cid).name.startsWith("\u231B")) {
          client.channels.cache
            .get(data.cid)
            .messages.fetch()
            .then((messages) => {
              let supportChannelTime = messages.map(
                (msg) => msg.createdTimestamp
              );
              let timenow2 = moment(supportChannelTime[0]).format(
                "YYYYMMDDHHmmss"
              );
              let split = moment(timenow2, "YYYYMMDDHHmmss")
                .fromNow()
                .split(" ");
              if (
                split[1] == "hour" ||
                split[1] == "hours" ||
                split[1] == "day" ||
                split[1] == "days"
              ) {
                let changeCC = client.channels.cache
                  .get(data.cid)
                  .name.split("");
                let changeCCC = changeCC.slice(1);
                client.channels.cache.get(data.cid).setName(changeCCC.join());
                client.channels.cache
                  .get(data.cid)
                  .send(
                    "Support session expired!\nYou can resume a session with: `resume caseNum`\nOr start a new session by simply typing:\n`help`"
                  );
              }
            });
        }
      }
    }
  }, 5000);

  //streamshit run
  setInterval(() => {
    const timerdb2 = db
      .prepare("SELECT * FROM timers ORDER BY time DESC;")
      .all();
    for (const data of timerdb2) {
      let timenow = moment().format("YYYYMMDDHHmmss");
      if (timenow > data.time) {
        if (data.bs !== "stream") return;
        return db
          .prepare(
            `DELETE FROM timers WHERE cid = ${data.cid} AND uid = ${data.uid}`
          )
          .run();
      }
    }
  }, 5000);

  //mutedshit run
  setInterval(() => {
    const timerdb = db
      .prepare("SELECT * FROM timers ORDER BY time DESC;")
      .all();
    for (const data of timerdb) {
      let timenow = moment().format("YYYYMMDDHHmmss");
      if (timenow > data.time) {
        let gettheguild = client.guilds.cache.get(data.gid);
        let reminduser = gettheguild.members.cache.get(data.uid);
        if (!reminduser) {
          return db
            .prepare(
              `DELETE FROM timers WHERE mid = ${data.mid} AND uid = ${data.uid}`
            )
            .run();
        }
        //try
        if (data.bs !== "mute") return;
        let userscore = getScore.get(data.uid, data.gid);
        if (userscore.muted == `0`)
          return db
            .prepare(
              `DELETE FROM timers WHERE mid = ${data.mid} AND uid = ${data.uid}`
            )
            .run();
        let memberrole = gettheguild.roles.cache.find(
          (r) => r.name === `~/Members`
        );
        reminduser.roles.add(memberrole).catch(console.error);
        let array2 = [];
        client.channels.cache
          .filter((channel) => channel.guild.id === data.gid)
          .map((channels) => array2.push(channels.id));
        for (let i of array2) {
          setTimeout(() => {
            let channel = client.channels.cache.find(
              (channel) => channel.id === i
            );
            if (channel) {
              if (channel.permissionOverwrites.get(data.uid)) {
                channel.permissionOverwrites.get(data.uid).delete();
              }
            }
          }, 200);
        }
        userscore.muted = `0`;
        userscore.warning = `0`;
        setScore.run(userscore);
        //
        client.channels.cache
          .get(data.cid)
          .send("<@" + data.uid + "> has been unmuted!");
        db.prepare(
          `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
        ).run();
      }
    }
  }, 5000);

  //preload messages on for teh reaction channel
  const fetch2 = db.prepare("SELECT * FROM guildhub").all();
  let array4 = [];
  for (const data of fetch2) {
    if (data.reactionChannel > 1) {
      array4.push(data.reactionChannel);
      if (client.channels.cache.get(data.reactionChannel)) {
        client.channels.cache.get(data.reactionChannel).messages.fetch();
      }
    }
  }

  //start Website
  dashboard.run(
    client,
    {
      port: 80,
      clientSecret: configfile.CLIENT_SECRET,
      redirectURI: configfile.REDIRECT_URI,
    },
    oAuth
  );

  //next
});

//Reconnect
client.once("shardReconnecting", (id) => {
  //Wipe music
  /* const musicf = fs.readdirSync("./music");
  for (const file of musicf) {
    fs.unlink("./music/" + file, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } */

  //reconnect console message fuck you too
  console.log(
    moment().format("MMMM Do YYYY, HH:mm:ss") +
      `\n${id} ` +
      __filename +
      ":" +
      ln() +
      `\nBot has reconnected, with ${client.users.cache.size} users.\nI am in ${client.guilds.cache.size} guilds:\n` +
      client.guilds.cache
        .filter((guild) => guild.owner !== undefined)
        .map(
          (guild) => `${guild.id}/${guild.name}\nUsers: ${guild.memberCount}`
        )
        .join("\n\n")
  );

  //next
});

//new member
client.on("guildMemberAdd", async (guildMember) => {
  //load module
  const onGuildMemberAdd = require("./modules/on_guildmemberadd.js");
  onGuildMemberAdd.onGuildMemberAdd(guildMember);

  //next
});

//member leaves
client.on("guildMemberRemove", async (guildMember) => {
  //load module
  const onGuildMemberRemove = require("./modules/on_guildmemberremove.js");
  onGuildMemberRemove.onGuildMemberRemove(guildMember);

  //next
});

//new guild
client.on("guildCreate", (guild) => {
  //log it into the console
  console.log(
    "Joined a new guild: " + guild.name + " Users: " + guild.memberCount
  );

  //Check if they have been sad returnees
  newGuild1 = getGuild.get(guild.id);
  if (!newGuild1) {
    newGuild = getGuild.get(guild.id);
    if (!newGuild) {
      if (!guild.roles.cache.find((r) => r.name === `~/Members`)) {
        guild.roles.create({
          data: {
            name: `~/Members`,
          },
          reason: "Needed for Artemis",
        });
      }
      newGuild = {
        guild: guild.id,
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
        wmessage: ``,
      };
      setGuild.run(newGuild);
    }
  }

  //next
});

//Fuck you too
client.on("guildDelete", (guild) => {
  //log the pitiful loser who left us
  console.log("Left a guild: " + guild.name + " Users: " + guild.memberCount);

  //next
});

//On member change
client.on("guildMemberUpdate", (oldMember, newMember) => {
  //load module
  const onMemberUpdate = require("./modules/on_member_update.js");
  onMemberUpdate.onMemberUpdate(oldMember, newMember);

  //next
});

//presence updates
client.on("presenceUpdate", (oldPresence, newPresence) => {
  //load module
  const onMemberPrupdate = require("./modules/on_member_prupdate.js");
  onMemberPrupdate.onMemberPrupdate(oldPresence, newPresence);

  //next
});

//reddit load rss
//Mint
emitter.add({
  url: "https://www.reddit.com/r/linuxmint/new.rss",
  refresh: 10000,
  ignoreFirst: true,
});

//Pop_OS
emitter.add({
  url: "https://www.reddit.com/r/pop_os/new.rss",
  refresh: 10000,
  ignoreFirst: true,
});

//reddit found a new shit message
emitter.on("item:new", (item) => {
  //converting all that data because emmiter sucks
  const reddittext = htmlToText.fromString(item.description, {
    wordwrap: false,
    ignoreHref: true,
    noLinkBrackets: true,
    preserveNewlines: true,
  });
  let reddittext2 = reddittext.replace("[link]", "").replace("[comments]", "");
  let reddittext3 = reddittext2.substr(0, 1000);

  //welp let's send the shit
  try {
    //mint
    if (item.link.startsWith("https://www.reddit.com/r/linuxmint/")) {
      const redditmessage = new Discord.MessageEmbed()
        .setTitle(item.title.substr(0, 100))
        .setURL(item.link)
        .setColor("RANDOM")
        .setDescription(reddittext3)
        .addField(
          item.link + "\n",
          "https://www.reddit.com" + item.author,
          true
        )
        .setTimestamp();
      return client.channels.cache.get("656194923107713024").send({
        embed: redditmessage,
      });
    }

    //pop_OS
    if (item.link.startsWith("https://www.reddit.com/r/pop_os/")) {
      const redditmessage = new Discord.MessageEmbed()
        .setTitle(item.title.substr(0, 100))
        .setURL(item.link)
        .setColor("RANDOM")
        .setDescription(reddittext3)
        .addField(
          item.link + "\n",
          "https://www.reddit.com" + item.author,
          true
        )
        .setTimestamp();
      return client.channels.cache.get("706777014610165780").send({
        embed: redditmessage,
      });
    }
  } catch {
    //log JK fuck you
    console.log();
  }

  //next
});

//go fuck yourself
emitter.on("feed:error", (error) => {
  //console.error(error.message)
});

//Message delete
client.on("messageDelete", async (message) => {
  //load module
  const onMessageDelete = require("./modules/on_message_delete.js");
  onMessageDelete.onMessageDelete(message);

  //next
});

//Banned fuckers
client.on("guildBanAdd", async (guild, user) => {
  //load module
  const onGuildBanAdd = require("./modules/on_guildbanadd.js");
  onGuildBanAdd.onGuildBanAdd(guild, user);

  //next
});

//Editing your own message does things
client.on("messageUpdate", (oldMessage, newMessage) => {
  //load module
  const onMsgUpdate = require("./modules/on_message_update.js");
  onMsgUpdate.onMsgUpdate(oldMessage, newMessage);

  //next
});

//the best thing here
client.on("message", async (message) => {
  //load module
  const onMessage = require("./modules/on_message.js");
  onMessage.onMessage(message);

  //next
});

//reactionroles and stuff
client.on("messageReactionAdd", async (reaction, user) => {
  //load module
  const onReaction = require("./modules/on_reaction.js");
  onReaction.onReaction(reaction, user);

  //end
});

//worthless errors, ignoring them fuck you
client.on("error", (e) => {});
client.on("warn", (e) => {});
client.on("debug", (e) => {});

//And login in the bot
client.login(configfile.token);
