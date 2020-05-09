/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require("express");
const passport = require("passport");
const session = require("express-session");

const DiscordStrategy = require("passport-discord.js").Strategy;
const app = express();
const { SESSION_SECRET } = require("../config.json");

const http = require("http");
const https = require("https");
const fs = require("fs");
const db = require("better-sqlite3")("./scores.sqlite");
const bodyParser = require("body-parser");
//Start database
//userstuff
const getScore = db.prepare(
  "SELECT * FROM scores WHERE user = ? ORDER BY guild DESC"
);
setScore = db.prepare(
  "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
);
//Guildchannels
getGuild = db.prepare(
  "SELECT * FROM guildhub WHERE guild = ? ORDER BY guild DESC"
);
setGuild = db.prepare(
  "INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);"
);
//rolesdb
getRoles = db.prepare(
  "SELECT * FROM roles WHERE guild = ? ORDER BY guild DESC"
);
setRoles = db.prepare(
  "INSERT OR REPLACE INTO roles (guild, roles) VALUES (@guild, @roles);"
);
//Worddb
getWords = db.prepare(
  "SELECT * FROM words WHERE guild = ? ORDER BY guild DESC"
);
setWords = db.prepare(
  "INSERT OR REPLACE INTO words (guild, words) VALUES (@guild, @words);"
);
//levelup
getLevel = db.prepare(
  "SELECT * FROM level WHERE guild = ? ORDER BY guild DESC"
);
setLevel = db.prepare(
  "INSERT OR REPLACE INTO level (guild, lvl5, lvl10, lvl15, lvl20, lvl30, lvl50, lvl85) VALUES (@guild, @lvl5, @lvl10, @lvl15, @lvl20, @lvl30, @lvl50, @lvl85);"
);

exports.run = (client, config) => {
  // App view
  app.set("view engine", "ejs");
  app.set("views", "./modules/web/views");
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(function (req, res, next) {
    if (req.secure) {
      next();
    } else {
      res.redirect(301, "https://" + req.headers.host + req.url);
    }
  });
  // Asset directories
  app.use("/static", express.static("./modules/web/add"));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false,
      },
    })
  );

  // passport login strategy
  passport.use(
    new DiscordStrategy(
      {
        clientID: client.user.id,
        clientSecret: config.clientSecret,
        callbackURL: config.redirectURI,
        scope: ["identify"],
      },
      function (accessToken, refreshToken, profile, done) {
        //Handle Database Query Addition Here.
        //console.log(profile);
        return done(null, profile);
      }
    )
  );

  passport.serializeUser(function (u, d) {
    d(null, u);
  });
  passport.deserializeUser(function (u, d) {
    d(null, u);
  });

  /////////////
  // Index page
  /////////////
  app.get("/", (req, res) => {
    if (!req.session.user) {
      const test = {
        client: client,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //Start user panel
      function data1(user) {
        const array = [];
        const image = [];
        let count = -1;
        client.guilds.cache.map((guild) => image.push(guild.iconURL({ format: 'jpg' })));
        for (const data of getScore.all(user.id)) {
          for (let i of image) {
            if (!i) {
            } else {
              if (i.includes(data.guild)) {
                if (data.translate == "2") {
                  var translation = "ON";
                } else {
                  var translation = "OFF";
                }
                if (data.stream == "2") {
                  var streaming = "OFF";
                } else {
                  var streaming = "ON";
                }
                count++;
                let guildsizeget = client.guilds.cache.get(data.guild);
                array.push(
                  '<button class="collapsible"><img src ="' +
                    i +
                    '" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">' +
                    `${client.guilds.cache.get(data.guild)}` +
                    " (" +
                    guildsizeget.memberCount +
                    " members)" +
                    '</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center"><tr style="text-align:left"><th>Level:</th><th>' +
                    data.level +
                    '</th></tr><tr style="text-align:left; border-bottom: 1px solid black"><td>Points:</td><td>' +
                    data.points +
                    '</td></tr><tr style="text-align:left; border-bottom: 1px solid black"><td>Warning points:</td><td>' +
                    data.warning +
                    '</td></tr><tr style="text-align:left; border-bottom: 1px solid black"><td>Auto Translation:</td><td><div id="' +
                    count +
                    'TRA">' +
                    translation +
                    '</div></td></tr><tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data3"><option value="' +
                    count +
                    ' TR OFF">off</option><option value="' +
                    count +
                    ' TR ON">on</option></select><input type="submit" class="button" onclick="document.getElementById(`' +
                    count +
                    'TRA`).innerHTML = `Changed!`" value="Save"></form></td></tr><tr style="text-align:left; border-bottom: 1px solid black"><td>Stream Notifications:</td><td><div id="' +
                    count +
                    'STR">' +
                    streaming +
                    '</div></td></tr><tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data3"><option value="' +
                    count +
                    ' ST OFF">off</option><option value="' +
                    count +
                    ' ST ON">on</option></select><input type="submit" class="button" onclick="document.getElementById(`' +
                    count +
                    'STR`).innerHTML = `Changed!`" value="Save"></form></td></tr></table></div>\n'
                );
              }
            }
          }
        }
        return array.toString().replace(/,/g, "");
      }
      //
      //client
      const test = {
        client: client,
      };
      //
      //Render
      res.render("index", {
        page: "dashboard",
        test: test,
        data: data1(req.session.user),
        userInfo: req.session.user,
      });
    }
  });

  ///////////////////
  // leaderboard page
  ///////////////////
  app.get("/board", (req, res) => {
    if (!req.session.user) {
      const test = {
        client: client,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //Leaderboard
      function data8(user) {
        let array = [];
        let gid = [];
        client.guilds.cache.map((guild) => gid.push(guild.id));
        for (let i of gid) {
          for (const data of getGuild.all(i)) {
            let gettheguild = client.guilds.cache.get(data.guild);
            let thiss = gettheguild.members.cache.get(user.id);
            if (thiss) {
              let top1 =
                '<button class="collapsible"><img src ="' +
                gettheguild.iconURL({ format: 'jpg' }) +
                '" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">' +
                `${client.guilds.cache.get(data.guild)}` +
                '</div></button><div class="colpanel"><table width="100%" style="table-layout: fixed; max-width: 100px; border-collapse: collapse;" align="center">';
              array.push(top1);
              let count2 = 0;
              const leader = db
                .prepare(
                  "SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;"
                )
                .all(gettheguild.id);
              for (const data2 of leader) {
                let thisss = gettheguild.members.cache.get(data2.user);
                if (thisss) {
                  if (data2.points > 5) {
                    count2++;
                    array.push(
                      '<tr style="text-align:left; border-bottom: 1px solid black"><td style="width: 300px;">(' +
                        count2 +
                        ') <img src ="' +
                        thisss.user.avatarURL() +
                        '" width="20px" height="20px"> ' +
                        thisss.user.username +
                        '</td><td style="width: 150px;">Lvl: ' +
                        data2.level +
                        " Pts: " +
                        data2.points +
                        "</td></tr>"
                    );
                  }
                }
              }
              let bot1 = "</table></div>";
              array.push(bot1);
            }
          }
        }
        return array.toString().replace(/,/g, "");
      }
      //
      //client
      const test = {
        client: client,
      };
      //
      //Render
      res.render("board", {
        page: "board",
        test: test,
        data8: data8(req.session.user),
        userInfo: req.session.user,
      });
    }
  });

  ///////////////
  // control page
  ///////////////
  app.get("/control", (req, res) => {
    if (!req.session.user) {
      const test = {
        client: client,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //control panel
      function data2(user) {
        let array = [];
        let gid = [];
        client.guilds.cache.map((guild) => gid.push(guild.id));
        for (let i of gid) {
          for (const data of getGuild.all(i)) {
            let gettheguild = client.guilds.cache.get(data.guild);
            //check perms
            let thiss = gettheguild.members.cache.get(user.id);
            if (thiss) {
              let rolec = thiss.permissions.has("KICK_MEMBERS");
              if (!gettheguild.owner) {
              } else {
                if (
                  gettheguild.owner.id == user.id ||
                  rolec.toString().includes("true")
                ) {
                  //If rolec is true
                  let top1 =
                    '<button class="collapsible"><img src ="' +
                    gettheguild.iconURL({ format: 'jpg' }) +
                    '" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">' +
                    `${client.guilds.cache.get(data.guild)}` +
                    '</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
                  let bot1 = "</table></div>";
                  let s1 = gettheguild.channels.cache.find(
                    (channel) => channel.id === data.generalChannel
                  );
                  if (!s1) {
                    var se1 = "None Set";
                  } else {
                    var se1 = s1.name;
                  }
                  let a1 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>generalChannel</td><td><div id="' +
                    data.guild +
                    'a1">#' +
                    se1 +
                    "</div></td></tr>";
                  let s2 = gettheguild.channels.cache.find(
                    (channel) => channel.id === data.logsChannel
                  );
                  if (!s2) {
                    var se2 = "None Set";
                  } else {
                    var se2 = s2.name;
                  }
                  let a2 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>logsChannel</td><td><div id="' +
                    data.guild +
                    'a2">#' +
                    se2 +
                    "</div></td></tr>";
                  let s3 = gettheguild.channels.cache.find(
                    (channel) => channel.id === data.muteChannel
                  );
                  if (!s3) {
                    var se3 = "None Set";
                  } else {
                    var se3 = s3.name;
                  }
                  let a3 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>muteChannel</td><td><div id="' +
                    data.guild +
                    'a3">#' +
                    se3 +
                    "</div></td></tr>";
                  let s4 = gettheguild.channels.cache.find(
                    (channel) => channel.id === data.highlightChannel
                  );
                  if (!s4) {
                    var se4 = "None Set";
                  } else {
                    var se4 = s4.name;
                  }
                  let a4 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>highlightChannel</td><td><div id="' +
                    data.guild +
                    'a4">#' +
                    se4 +
                    "</div></td></tr>";
                  let s5 = gettheguild.channels.cache.find(
                    (channel) => channel.id === data.reactionChannel
                  );
                  if (!s5) {
                    var se5 = "None Set";
                  } else {
                    var se5 = s5.name;
                  }
                  let a5 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>reactionChannel</td><td><div id="' +
                    data.guild +
                    'a5">#' +
                    se5 +
                    "</div></td></tr>";
                  let s6 = gettheguild.channels.cache.find(
                    (channel) => channel.id === data.streamChannel
                  );
                  if (!s6) {
                    var se6 = "None Set";
                  } else {
                    var se6 = s6.name;
                  }
                  let a6 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>streamChannel</td><td><div id="' +
                    data.guild +
                    'a6">#' +
                    se6 +
                    "</div></td></tr>";
                  //start forms
                  let ct1 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="" selected disabled hidden>Choose General Channel</option>';
                  let c1 = gettheguild.channels.cache
                    .filter((channel) => channel.type === "text")
                    .map(
                      (channels) =>
                        '<option value="1 ' +
                        data.guild +
                        " " +
                        channels.id +
                        '">#' +
                        channels.name +
                        "</option>"
                    );
                  let cb1 =
                    '</select><input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'a1`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  let ct2 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="" selected disabled hidden>Choose Logs Channel</option>';
                  let c2 = gettheguild.channels.cache
                    .filter((channel) => channel.type === "text")
                    .map(
                      (channels) =>
                        '<option value="2 ' +
                        data.guild +
                        " " +
                        channels.id +
                        '">#' +
                        channels.name +
                        "</option>"
                    );
                  let cb2 =
                    '</select><input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'a2`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  let ct3 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="" selected disabled hidden>Choose Mute Channel</option>';
                  let c3 = gettheguild.channels.cache
                    .filter((channel) => channel.type === "text")
                    .map(
                      (channels) =>
                        '<option value="3 ' +
                        data.guild +
                        " " +
                        channels.id +
                        '">#' +
                        channels.name +
                        "</option>"
                    );
                  let cb3 =
                    '</select><input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'a3`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  let ct4 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="" selected disabled hidden>Choose HighLight Channel</option>';
                  let c4 = gettheguild.channels.cache
                    .filter((channel) => channel.type === "text")
                    .map(
                      (channels) =>
                        '<option value="4 ' +
                        data.guild +
                        " " +
                        channels.id +
                        '">#' +
                        channels.name +
                        "</option>"
                    );
                  let cb4 =
                    '</select><input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'a4`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  let ct5 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="" selected disabled hidden>Choose Roles Channel</option>';
                  let c5 = gettheguild.channels.cache
                    .filter((channel) => channel.type === "text")
                    .map(
                      (channels) =>
                        '<option value="5 ' +
                        data.guild +
                        " " +
                        channels.id +
                        '">#' +
                        channels.name +
                        "</option>"
                    );
                  let cb5 =
                    '</select><input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'a5`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  let ct6 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="" selected disabled hidden>Choose Stream Channel</option>';
                  let c6 = gettheguild.channels.cache
                    .filter((channel) => channel.type === "text")
                    .map(
                      (channels) =>
                        '<option value="6 ' +
                        data.guild +
                        " " +
                        channels.id +
                        '">#' +
                        channels.name +
                        "</option>"
                    );
                  let cb6 =
                    '</select><input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'a6`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  //start rest
                  //Automod
                  if (data.autoMod == "2") {
                    var autom = "ON";
                  } else {
                    var autom = "OFF";
                  }
                  let rapp1t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Auto Mod:</td><td><div id="' +
                    data.guild +
                    'rapp1">' +
                    autom +
                    "</div></td></tr>";
                  let rapp1 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="am ' +
                    data.guild +
                    ' OFF">off</option><option value="am ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp1b =
                    '<input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'rapp1`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  //leveling
                  if (data.leveling == "2") {
                    var lvlm = "OFF";
                  } else {
                    var lvlm = "ON";
                  }
                  let rapp4t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Leveling:</td><td><div id="' +
                    data.guild +
                    'rapp4">' +
                    lvlm +
                    "</div></td></tr>";
                  let rapp4 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="lv ' +
                    data.guild +
                    ' OFF">off</option><option value="lv ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp4b =
                    '<input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'rapp4`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  //streamhere
                  if (data.streamHere == "2") {
                    var streamm = "ON";
                  } else {
                    var streamm = "OFF";
                  }
                  let rapp2t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Stream @here pings:</td><td><div id="' +
                    data.guild +
                    'rapp2">' +
                    streamm +
                    "</div></td></tr>";
                  let rapp2 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="sh ' +
                    data.guild +
                    ' OFF">off</option><option value="sh ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp2b =
                    '<input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'rapp2`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  //prefix
                  let rapp3t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Server prefix:</td><td><div id="' +
                    data.guild +
                    'rapp3">' +
                    data.prefix +
                    "</div></td></tr>";
                  let rapp3 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><input type="hidden" name="data2" value="pr ' +
                    data.guild +
                    '" /><input type="text" name="data2" value="prefix">';
                  let rapp3b =
                    '<input type="submit" class="button" onclick="document.getElementById(`' +
                    data.guild +
                    'rapp3`).innerHTML = `Changed!`" value="Save"></form></td></tr>';
                  //push shit
                  array.push(
                    top1 +
                      rapp3t +
                      rapp3 +
                      rapp3b +
                      rapp4t +
                      rapp4 +
                      rapp4b +
                      rapp1t +
                      rapp1 +
                      rapp1b +
                      rapp2t +
                      rapp2 +
                      rapp2b +
                      a1 +
                      ct1 +
                      c1 +
                      cb1 +
                      a2 +
                      ct2 +
                      c2 +
                      cb2 +
                      a3 +
                      ct3 +
                      c3 +
                      cb3 +
                      a4 +
                      ct4 +
                      c4 +
                      cb4 +
                      a5 +
                      ct5 +
                      c5 +
                      cb5 +
                      a6 +
                      ct6 +
                      c6 +
                      cb6 +
                      bot1 +
                      "\n"
                  );
                }
              }
            }
            //
          }
        }
        return array.toString().replace(/,/g, "");
      }
      //
      //client
      const test = {
        client: client,
      };
      //
      //Render
      res.render("control", {
        page: "control",
        test: test,
        data2: data2(req.session.user),
        userInfo: req.session.user,
      });
    }
  });

  ///////////////
  // Command page
  ///////////////
  app.get("/command", (req, res) => {
    if (!req.session.user) {
      const test = {
        client: client,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //commands panel
      //mod
      function commands2() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Mod Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[mod]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //Server
      function commands3() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Server Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[server]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //mscore
      function commands4() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Mscore Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[mscore]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //general
      function commands5() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">General Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[general]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //level
      function commands6() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Level Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[level]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //linux
      function commands7() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Linux Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[linux]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //Fun
      function commands8() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Fun Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[fun]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //stream
      function commands9() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Stream Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[stream]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //Music
      function commands10() {
        let str1 = [];
        let top1 =
          '<button class="collapsible"><img src ="/static/images/artava.png" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">Music Commands</div></button><div class="colpanel"><table width="100%" style="border-collapse: collapse;" align="center">';
        let bot1 = "</table></div>";
        const commandFiles = fs
          .readdirSync("/root/Server/commands")
          .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`/root/Server/commands/${file}`);
          if (command.description.includes(`[music]`))
            str1.push(
              '<tr style="text-align:left; border-bottom: 1px solid black"><td>' +
                command.name +
                "</td><td>" +
                command.description +
                "</td></tr>"
            );
        }
        let this1 =
          top1.toString().replace(/,/g, "") +
          str1.toString().replace(/,/g, "") +
          bot1.toString().replace(/,/g, "");
        return this1;
      }
      //
      //client
      const test = {
        client: client,
      };
      //
      //Render
      res.render("command", {
        page: "command",
        test: test,
        commands2: commands2(),
        commands3: commands3(),
        commands4: commands4(),
        commands5: commands5(),
        commands6: commands6(),
        commands7: commands7(),
        commands8: commands8(),
        commands9: commands9(),
        commands10: commands10(),
        userInfo: req.session.user,
      });
    }
  });

  //////
  //post
  //////
  app.post("/", function (req, res) {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////USER CHANGES///////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //recycle
    if (req.body.data3) {
      const array = [];
      const image = [];
      client.guilds.cache.map((guild) => image.push(guild.iconURL({ format: 'jpg' })));
      for (const data of getScore.all(req.session.user.id)) {
        for (let i of image) {
          if (!i) {
          } else {
            if (i.includes(data.guild)) {
              array.push(data);
            }
          }
        }
      }
      //change data to array
      var data3 = req.body.data3.split(" ");
      //num err
      if (isNaN(data3[0])) return console.log("Error");
      //numlength err
      if (data3[0] > array.length) return console.log("Error2");
      //num is c
      let c = data3[0];
      //renew db
      getScore2 = db.prepare(
        "SELECT * FROM scores WHERE user = ? AND guild = ? ORDER BY guild DESC"
      );
      setScore2 = db.prepare(
        "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
      );
      //Translate
      if (data3[1] == "TR") {
        let translate = getScore2.get(req.session.user.id, array[c].guild);
        if (data3[2] == "ON") {
          translate.translate = `2`;
          setScore.run(translate);
          res.status(204).send();
        }
        if (data3[2] == "OFF") {
          translate.translate = `1`;
          setScore.run(translate);
          res.status(204).send();
        }
      }
      //stream
      if (data3[1] == "ST") {
        let stream = getScore2.get(req.session.user.id, array[c].guild);
        if (data3[2] == "ON") {
          stream.stream = `1`;
          setScore.run(stream);
          res.status(204).send();
        }
        if (data3[2] == "OFF") {
          stream.stream = `2`;
          setScore.run(stream);
          res.status(204).send();
        }
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////ADMIN/MOD CHANGES//////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (req.body.data2) {
      let x1 = req.body.data2.toString();
      let x3 = x1.replace(/,/g, " ");
      let data2 = x3.split(" ");
      //start
      let gettheguild = client.guilds.cache.get(data2[1]);
      if (!gettheguild) return res.status(204).send();
      getGuild2 = db.prepare(
        "SELECT * FROM guildhub WHERE guild = ? ORDER BY guild DESC"
      );
      setGuild2 = db.prepare(
        "INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);"
      );
      //check perms
      let thiss = gettheguild.members.cache.get(req.session.user.id);
      if (thiss) {
        let rolec = thiss.permissions.has("KICK_MEMBERS");
        if (
          gettheguild.owner.id == req.session.user.id ||
          rolec.toString().includes("true")
        ) {
          //start stuff
          if (data2[0] == "1") {
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );
            if (!findme) return res.status(204).send();
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.generalChannel = findme.id;
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "2") {
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );
            if (!findme) return res.status(204).send();
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.logsChannel = findme.id;
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "3") {
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );
            if (!findme) return res.status(204).send();
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.muteChannel = findme.id;
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "4") {
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );
            if (!findme) return res.status(204).send();
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.highlightChannel = findme.id;
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "5") {
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );
            if (!findme) return res.status(204).send();
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.reactionChannel = findme.id;
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "6") {
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );
            if (!findme) return res.status(204).send();
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.streamChannel = findme.id;
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "pr") {
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.prefix = data2.slice(2).join(" ");
            setGuild.run(channelstuff);
            return res.status(204).send();
          }
          if (data2[0] == "am") {
            if (data2[2] == "ON") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.autoMod = `2`;
              setGuild.run(channelstuff);
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.autoMod = `1`;
              setGuild.run(channelstuff);
              return res.status(204).send();
            }
          }
          if (data2[0] == "lv") {
            if (data2[2] == "ON") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.leveling = `1`;
              setGuild.run(channelstuff);
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.leveling = `2`;
              setGuild.run(channelstuff);
              return res.status(204).send();
            }
          }
          if (data2[0] == "sh") {
            if (data2[2] == "ON") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.streamHere = `2`;
              setGuild.run(channelstuff);
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.streamHere = `1`;
              setGuild.run(channelstuff);
              return res.status(204).send();
            }
          }
          //end stuff
          return res.status(204).send();
        }
      }
      //end
      res.status(204).send();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  });

  app.get("/auth/discord", passport.authenticate("discord.js"));
  app.get(
    "/auth/discord/callback",
    passport.authenticate("discord.js", {
      failureRedirect: "/auth/discord/error",
    }),
    function (req, res) {
      req.session.user = req.session.passport.user;
      console.log(
        `(${req.session.user.id}) ${req.session.user.username}: Logged in.`
      );
      res.redirect("/");
    }
  );
  app.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  });
  app.get("*", function (req, res) {
    res.redirect("/");
  });
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/artemisbot.eu/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/artemisbot.eu/cert.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/artemisbot.eu/chain.pem",
    "utf8"
  );

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };
  const httpsServer = https.createServer(credentials, app);
  const httpServer = http.createServer(app);

  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });

  httpServer.listen(80, () => {
    console.log("HTTP Server running on port 80");
  });
};
