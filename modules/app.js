/***
 * @fileOverview The back-end module which is running express.js
 */

//load modules
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const DiscordStrategy = require("passport-discord.js").Strategy;
const app = express();
const { SESSION_SECRET } = require("../config.json");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const db = require("better-sqlite3")("./scores.sqlite");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const moment = require("moment");

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
  "INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix, leveling, wmessage) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix, @leveling, @wmessage);"
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

//run Settings
getSettings = db.prepare("SELECT * FROM settings WHERE guild = ?");
setSettings = db.prepare(
  "INSERT OR REPLACE INTO settings (guild, leavejoin, deletemsg, editmsg, bumpping) VALUES (@guild, @leavejoin, @deletemsg, @editmsg, @bumpping);"
);

//run extra options
getEo = db.prepare("SELECT * FROM eo WHERE guildid = ?");
setEo = db.prepare(
  "INSERT OR REPLACE INTO eo (guildid, artreplies) VALUES (@guildid, @artreplies);"
);

//start
exports.run = (client, config) => {
  // App view
  app.set("view engine", "ejs");
  app.set("views", "./modules/web/views");
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  //require https
  app.use(function (req, res, next) {
    if (req.secure) {
      next();
    } else {
      res.redirect(301, "https://" + req.headers.host + req.url);
    }
  });

  // Asset directories
  app.use("/static", express.static("./modules/web/add"));

  //Discord redirect thing
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
  // Index page (rew)
  /////////////
  app.get("/", (req, res) => {
    //check if user is logged in
    if (!req.session.user) {
      const test = {
        client: client,
        db: db,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //Start data1
      function data1(user) {
        //empty array
        const array = [];

        //guild images
        const image = [];

        //map guild icons
        client.guilds.cache.map((guild) =>
          image.push(guild.iconURL({ format: "jpg" }))
        );

        //loop trough data
        for (const data of getScore.all(user.id)) {
          //loop trough the images
          for (let i of image) {
            //check if it exists
            if (!i) {
            } else {
              //if guild data exists
              if (i.includes(data.guild)) {
                //guild data
                let guildsizeget = client.guilds.cache.get(data.guild);

                //push into array
                array.push(
                  `<br>
                  <button id="${
                    data.guild
                  }b" class="collapsible" onclick=\"toggle('${data.guild}')\">
                    <img src ="${i}" width="30px" height="30px" style="border-radius: 50%;">
                    <div class="textcol">
                        ${client.guilds.cache.get(data.guild)}
                        (${guildsizeget.memberCount} members)
                    </div>
                  </button>

                  <div class="content" id="${data.guild}">
                    <table width="100%" style="border-collapse: collapse;" align="center">
                      <tr style="text-align:left">
                        <th>
                          Level:
                        </th>
                        <th>
                          ${data.level}
                        </th>
                      </tr>
                    <tr style="text-align:left; border-bottom: 1px solid black">
                      <td>
                        Cash:
                      </td>
                      <td>
                        \u058F  ${data.points}
                      </td>
                    </tr>
                    <tr style="text-align:left; border-bottom: 1px solid black">
                      <td>
                        Warning points:
                      </td>
                      <td>
                        ${data.warning}
                      </td>
                    </tr>
                    <tr style="text-align:left; border-bottom: 1px solid black">
                      <td>
                        Delete data:
                      </td>
                      <td>
                        <div id="${data.guild}STR">
                          This will delete all user data connected to this server
                        </div>
                      </td>
                    </tr>
                    <tr style="text-align:left; border-bottom: 1px solid black">
                      <td>
                      </td>
                      <td>
                        <form action="/" method="post">
                        <select name="data3" style="display: none;">
                          <option value="${data.guild} ST DELETE">
                            off
                          </option>
                        </select>
                        <input type="submit" class="button" onclick="notification('Deleted data for:<br>${client.guilds.cache.get(
                          data.guild
                        )}'); document.getElementById('${
                    data.guild
                  }').style.display = 'none'; document.getElementById('${
                    data.guild
                  }b').style.display = 'none'" value="Delete my data!">
                        </form>
                      </td>
                    </tr>
                    </table>
                    </div>\n`
                );
              }
            }
          }
        }

        //return array after formatting
        return array.join(" ");
      }

      //client
      const test = {
        client: client,
        db: db,
      };

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
    //check if user is logged in
    if (!req.session.user) {
      const test = {
        client: client,
        db: db,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //Leaderboard
      function data8(user) {
        //empty array
        let array = [];

        //guild ID
        let gid = [];

        //push guild ID
        client.guilds.cache.map((guild) => gid.push(guild.id));

        //scroll trough guild ID
        for (let i of gid) {
          //loop trough called guild data
          for (const data of getGuild.all(i)) {
            //get guild
            let gettheguild = client.guilds.cache.get(data.guild);

            //catch user
            let thiss = gettheguild.members.cache.get(user.id);

            //if User
            if (thiss) {
              //first push
              array.push(
                `<br><button onclick=\"toggle('${
                  data.guild
                }')\" class="collapsible">
                <img src ="${gettheguild.iconURL({
                  format: "jpg",
                })}" width="30px" height="30px" style="border-radius: 50%;">
                <div class="textcol">${client.guilds.cache.get(data.guild)} (${
                  gettheguild.memberCount
                } Members)</div>
                </button>
                <div class="content" id="${data.guild}">
                <table width="100%" style="border-collapse: collapse;" align="center">`
              );

              //second counter
              let count2 = 0;

              //select by points
              const leader = db
                .prepare(
                  "SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;"
                )
                .all(gettheguild.id);

              //loop trough data
              for (const data2 of leader) {
                //get user data
                let thisss = gettheguild.members.cache.get(data2.user);

                //if user
                if (thisss) {
                  //if has more than 5 points
                  if (data2.points > 5) {
                    //upp counter
                    count2++;

                    //if even
                    if (count2 % 2 == 0) {
                      //second push
                      array.push(`
                      <tr style="text-align:left; border-bottom: 1px solid black"><td style="width: 50%;">(${count2}) 
                      <a href ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                      })}" target="_blank">
                      <img src ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 128,
                      })}" width="20px" height="20px"></a>
                      ${thisss.user.username.replace(/\</g, "&lt;")}
                      </td>
                      <td style="width: 50%;">Level: ${data2.level} | \u058F  ${
                        data2.points
                      }</td></tr>`);
                    } else {
                      //second push
                      array.push(`
                      <tr style="text-align:left; border-bottom: 1px solid black; background-color: rgba(60, 255, 0, 0.03);"><td style="width: 50%;">(${count2}) 
                      <a href ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                      })}" target="_blank">
                      <img src ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 128,
                      })}" width="20px" height="20px"></a>
                      ${thisss.user.username.replace(/\</g, "&lt;")}
                      </td>
                      <td style="width: 50%;">Level: ${data2.level} | \u058F  ${
                        data2.points
                      }</td></tr>`);
                    }
                  }
                }
              }

              //final push
              array.push(`</table></div>`);
            }
          }
        }

        //return array
        return array.join(" ");
      }

      //client
      const test = {
        client: client,
        db: db,
      };

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
    //check if user is logged in
    if (!req.session.user) {
      const test = {
        client: client,
        db: db,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //control panel
      function data2(user) {
        //empty array
        let array = [];

        //empty guild ID
        let gid = [];

        //push guilds into gid
        client.guilds.cache.map((guild) => gid.push(guild.id));

        //loop gid
        for (let i of gid) {
          //loop trough database entries
          for (const data of getGuild.all(i)) {
            //define guild
            let gettheguild = client.guilds.cache.get(data.guild);

            //get user
            let thiss = gettheguild.members.cache.get(user.id);

            //if user exists
            if (thiss) {
              //check if user has certain perms
              let rolec = thiss.permissions.has("KICK_MEMBERS");

              //if no guild owner
              if (!gettheguild.owner) {
              } else {
                //if user is guild owner or has proper perms
                if (
                  gettheguild.owner.id == user.id ||
                  rolec.toString().includes("true")
                ) {
                  //map channels
                  const chan = gettheguild.channels.cache.map(
                    (c) => `${c.id} ${c.type} ${c.name}`
                  );

                  //build top part of array
                  let top1 = `<br><button onclick=\"toggle('${
                    data.guild
                  }')\" class="collapsible">
                    <img src ="${gettheguild.iconURL({
                      format: "jpg",
                    })}" width="30px" height="30px" style="border-radius: 50%;">
                    <div class="textcol">${client.guilds.cache.get(
                      data.guild
                    )} (${gettheguild.memberCount} Members)</div></button>
                    <div id="${data.guild}" class="content">
                    <table width="100%" style="border-collapse: collapse;" align="center">`;

                  //build bottom part of array
                  let bot1 = "</table></div>";

                  /////////////////
                  //NAME CHANNELS//
                  /////////////////

                  //generalChannel name
                  var se1 = [];

                  chan.forEach((c) => {
                    if (
                      data.generalChannel.length > 1 &&
                      c.includes(`${data.generalChannel}`)
                    )
                      se1.push(
                        c
                          .replace(`${data.generalChannel}`, "")
                          .replace(`text`, "")
                      );
                  });

                  if (se1.toString() == "") var se1 = "None set";

                  //logsChannel name
                  var se2 = [];

                  chan.forEach((c) => {
                    if (
                      data.logsChannel.length > 1 &&
                      c.includes(`${data.logsChannel}`)
                    )
                      se2.push(
                        c.replace(`${data.logsChannel}`, "").replace(`text`, "")
                      );
                  });

                  if (se2.toString() == "") var se2 = "None set";

                  //muteChannel name
                  var se3 = [];

                  chan.forEach((c) => {
                    if (
                      data.muteChannel.length > 1 &&
                      c.includes(`${data.muteChannel}`)
                    )
                      se3.push(
                        c.replace(`${data.muteChannel}`, "").replace(`text`, "")
                      );
                  });

                  if (se3.toString() == "") var se3 = "None set";

                  //highlightChannel name
                  var se4 = [];

                  chan.forEach((c) => {
                    if (
                      data.highlightChannel.length > 1 &&
                      c.includes(`${data.highlightChannel}`)
                    )
                      se4.push(
                        c
                          .replace(`${data.highlightChannel}`, "")
                          .replace(`text`, "")
                      );
                  });

                  if (se4.toString() == "") var se4 = "None set";

                  //reactionChannel name
                  var se5 = [];

                  chan.forEach((c) => {
                    if (
                      data.reactionChannel.length > 1 &&
                      c.includes(`${data.reactionChannel}`)
                    )
                      se5.push(
                        c
                          .replace(`${data.reactionChannel}`, "")
                          .replace(`text`, "")
                      );
                  });

                  if (se5.toString() == "") var se5 = "None set";

                  //streamChannel name
                  var se6 = [];

                  chan.forEach((c) => {
                    if (
                      data.streamChannel.length > 1 &&
                      c.includes(`${data.streamChannel}`)
                    )
                      se6.push(
                        c
                          .replace(`${data.streamChannel}`, "")
                          .replace(`text`, "")
                      );
                  });

                  if (se6.toString() == "") var se6 = "None set";

                  //support
                  let getSupport2 = db.prepare(
                    "SELECT * FROM support WHERE gid = ?"
                  );

                  let grabChan = getSupport2.get(gettheguild.id);

                  if (grabChan) {
                    //mainchan name
                    var se7 = [];

                    chan.forEach((c) => {
                      if (
                        grabChan.mainchan.length > 1 &&
                        c.includes(`${grabChan.mainchan}`)
                      )
                        se7.push(
                          c
                            .replace(`${grabChan.mainchan}`, "")
                            .replace(`category`, "")
                        );
                    });

                    if (se7.toString() == "") var se7 = "None set";

                    //inusechan name
                    var se8 = [];

                    chan.forEach((c) => {
                      if (
                        grabChan.inusechan.length > 1 &&
                        c.includes(`${grabChan.inusechan}`)
                      )
                        se8.push(
                          c
                            .replace(`${grabChan.inusechan}`, "")
                            .replace(`category`, "")
                        );
                    });

                    if (se8.toString() == "") var se8 = "None set";
                  }

                  //start channel build
                  let channelPush = `
                  <!--//build general-->
                    <tr style="text-align:left"><td><br><h2>Set up #Channels</h2></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Welcome</td>
                    <td><div id="${data.guild}a1">#${se1}</div></td></tr>

                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td><td>
                    <form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose General Channel</option>
                    <option value="1 ${data.guild} disable">DISABLE</option>
                    
                    ${gettheguild.channels.cache
                      .filter((channel) => channel.type === "text")
                      .map(
                        (channels) =>
                          `<option value="1 ${data.guild} ${channels.id}">#${channels.name}</option>`
                      )}

                    </select>
                    <br><input type="submit" id="${
                      data.guild
                    }1" class="button" onclick="notification('Edited:<br>Welcome Channel');
                    document.getElementById('${
                      data.guild
                    }1').style.display = 'none'" value="Save">
                    </form></td></tr>
                    

                  <!--//build logs-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Logs</td>
                    <td><div id="${data.guild}a2">#${se2}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Logs Channel</option>
                    <option value="2 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
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
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }2" class="button" onclick="notification('Edited:<br>Logs Channel');
                    document.getElementById('${
                      data.guild
                    }2').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build mute-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Mute/Verify</td>
                    <td><div id="${data.guild}a3">#${se3}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Mute Channel</option>
                    <option value="3 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
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
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }3" class="button" onclick="notification('Edited:<br>Mute/Verify Channel');
                    document.getElementById('${
                      data.guild
                    }3').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build highlights-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Highlights</td>
                    <td><div id="${data.guild}a4">#${se4}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose HighLight Channel</option>
                    <option value="4 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
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
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }4" class="button" onclick="notification('Edited:<br>Highlights Channel');
                    document.getElementById('${
                      data.guild
                    }4').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build reaction roles-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Reaction Roles</td>
                    <td><div id="${data.guild}a5">#${se5}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Roles Channel</option>
                    <option value="5 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
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
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }5" class="button" onclick="notification('Edited:<br>Reaction Roles Channel');
                    document.getElementById('${
                      data.guild
                    }5').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build stream notification channel-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Stream Notification</td>
                    <td><div id="${data.guild}a6">#${se6}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Stream Channel</option>
                    <option value="6 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
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
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }6" class="button" onclick="notification('Edited:<br>Stream Notification Channel');
                    document.getElementById('${
                      data.guild
                    }6').style.display = 'none'" value="Save">
                    </form></td></tr>

                    
                    <tr style="text-align:left"><td><br><h2>Set up Support categories</h2></td></tr>

                    <!--//build Support category-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Support category</td>
                    <td><div id="${data.guild}a7">#${se7}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Support category</option>
                    <option value="7 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
                      .filter((channel) => channel.type === "category")
                      .map(
                        (channels) =>
                          '<option value="7 ' +
                          data.guild +
                          " " +
                          channels.id +
                          '">#' +
                          channels.name +
                          "</option>"
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }7" class="button" onclick="notification('Edited:<br>Support Category');
                    document.getElementById('${
                      data.guild
                    }7').style.display = 'none'" value="Save">
                    </form></td></tr>

                    <!--//build Support in-use category-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Support in-use category</td>
                    <td><div id="${data.guild}a8">#${se8}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Support in-use category</option>
                    <option value="8 ${data.guild} disable">DISABLE</option>
                    ${gettheguild.channels.cache
                      .filter((channel) => channel.type === "category")
                      .map(
                        (channels) =>
                          '<option value="8 ' +
                          data.guild +
                          " " +
                          channels.id +
                          '">#' +
                          channels.name +
                          "</option>"
                      )}
                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }8" class="button" onclick="notification('Edited:<br>Support in-use Category');
                    document.getElementById('${
                      data.guild
                    }8').style.display = 'none'" value="Save">
                    </form></td></tr>
                    `;

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
                  let rapp1b = `<br><input type="submit" id="${data.guild}9" class="button" onclick="notification('Edited:<br>AutoMod');
                    document.getElementById('${data.guild}9').style.display = 'none'" value="Save"></form></td></tr>`;

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
                  let rapp4b = `<br><input type="submit" id="${data.guild}10" class="button" onclick="notification('Edited:<br>Leveling');
                    document.getElementById('${data.guild}10').style.display = 'none'" value="Save"></form></td></tr>`;

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
                  let rapp2b = `<br><input type="submit" id="${data.guild}11" class="button" onclick="notification('Edited:<br>Stream @here pings');
                    document.getElementById('${data.guild}11').style.display = 'none'" value="Save"></form></td></tr>`;

                  //logsettings initiate
                  let loggerSettings = getSettings.get(data.guild);

                  //setting failsafe
                  if (!loggerSettings) {
                    loggerSettings = {
                      guild: data.guild,
                      leavejoin: `0`,
                      deletemsg: `0`,
                      editmsg: `0`,
                      bumpping: `0`,
                    };
                    setSettings.run(loggerSettings);
                  }

                  //logs leavejoin
                  if (loggerSettings.leavejoin == "1") {
                    var leavejoin = "ON";
                  } else {
                    var leavejoin = "OFF";
                  }
                  let rapp5t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Logs: Join/Leave message: </td><td><div id="' +
                    data.guild +
                    'rapp5">' +
                    leavejoin +
                    "</div></td></tr>";
                  let rapp5 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="lj ' +
                    data.guild +
                    ' OFF">off</option><option value="lj ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp5b = `<br><input type="submit" id="${data.guild}12" class="button" onclick="notification('Edited:<br>Join/Leave messages');
                    document.getElementById('${data.guild}12').style.display = 'none'" value="Save"></form></td></tr>`;

                  //logs msgedit
                  if (loggerSettings.editmsg == "1") {
                    var editmsg = "ON";
                  } else {
                    var editmsg = "OFF";
                  }
                  let rapp6t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Logs: Edit Message: </td><td><div id="' +
                    data.guild +
                    'rapp6">' +
                    editmsg +
                    "</div></td></tr>";
                  let rapp6 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="em ' +
                    data.guild +
                    ' OFF">off</option><option value="em ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp6b = `<br><input type="submit" id="${data.guild}13" class="button" onclick="notification('Edited:<br>Logs: Edit messages');
                    document.getElementById('${data.guild}13').style.display = 'none'" value="Save"></form></td></tr>`;

                  //logs deletemsg
                  if (loggerSettings.deletemsg == "1") {
                    var deletemsg = "ON";
                  } else {
                    var deletemsg = "OFF";
                  }
                  let rapp7t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Logs: Delete Message: </td><td><div id="' +
                    data.guild +
                    'rapp7">' +
                    deletemsg +
                    "</div></td></tr>";
                  let rapp7 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="dm ' +
                    data.guild +
                    ' OFF">off</option><option value="dm ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp7b = `<br><input type="submit" id="${data.guild}14" class="button" onclick="notification('Edited:<br>Logs: Deleted messages');
                    document.getElementById('${data.guild}14').style.display = 'none'" value="Save"></form></td></tr>`;

                  //Bump pings
                  if (loggerSettings.bumpping == "1") {
                    var bumpmsg = "OFF";
                  } else {
                    var bumpmsg = "ON";
                  }
                  let rapp8t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Bump Notifications: </td><td><div id="' +
                    data.guild +
                    'rapp8">' +
                    bumpmsg +
                    "</div></td></tr>";
                  let rapp8 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="bp ' +
                    data.guild +
                    ' OFF">off</option><option value="bp ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp8b = `<br><input type="submit" id="${data.guild}15" class="button" onclick="notification('Edited:<br>Reminders for bump bots');
                    document.getElementById('${data.guild}15').style.display = 'none'" value="Save"></form></td></tr>`;

                  //Extra Options initiate
                  let extraOptions = getEo.get(data.guild);

                  //Extra Options failsafe
                  if (!extraOptions) {
                    extraOptions = {
                      guildid: data.guild,
                      artreplies: `ON`,
                    };
                    setEo.run(extraOptions);
                  }

                  //Extra Options: Artemis Replies
                  if (extraOptions.artreplies == "OFF") {
                    var bumpmsg = "OFF";
                  } else {
                    var bumpmsg = "ON";
                  }
                  let rapp11t =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td>Artemis Replies: </td><td><div id="' +
                    data.guild +
                    'rapp11">' +
                    bumpmsg +
                    "</div></td></tr>";
                  let rapp11 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><select name="data2"><option value="ar ' +
                    data.guild +
                    ' OFF">off</option><option value="ar ' +
                    data.guild +
                    ' ON">on</option></select>';
                  let rapp11b = `<br><input type="submit" id="${data.guild}40" class="button" onclick="notification('Edited:<br>Artemis Replies');
                    document.getElementById('${data.guild}40').style.display = 'none'" value="Save"></form></td></tr>`;

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
                  let rapp3b = `<br><input type="submit" id="${data.guild}16" class="button" onclick="notification('Edited:<br>Server Prefix');
                    document.getElementById('${data.guild}16').style.display = 'none'" value="Save"></form></td></tr>`;

                  //welcome message
                  let wm1 =
                    '<tr style="text-align:left"><td><h2>Basic setup</h2></td></tr><tr style="text-align:left; border-bottom: 1px solid black"><td>Welcome message:</td><td><div id="' +
                    data.guild +
                    'wmD">Change welcome message below</div></td></tr>';
                  let wm2 =
                    '<tr style="text-align:left; border-bottom: 1px solid black"><td></td><td><form action="/" method="post"><input type="hidden" name="data2" value="wm ' +
                    data.guild +
                    '" /><textarea rows="5" cols="20" name="data2">' +
                    data.wmessage +
                    "</textarea>";
                  let wm3 = `<br><input type="submit" id="${data.guild}17" class="button" onclick="notification('Edited:<br>Welcome Message');
                    document.getElementById('${data.guild}17').style.display = 'none'" value="Save"></form></td></tr>`;

                  //Form webpage
                  array.push(
                    top1 +
                      wm1 +
                      wm2 +
                      wm3 +
                      rapp3t +
                      rapp3 +
                      rapp3b +
                      rapp4t +
                      rapp4 +
                      rapp4b +
                      rapp5t +
                      rapp5 +
                      rapp5b +
                      rapp6t +
                      rapp6 +
                      rapp6b +
                      rapp7t +
                      rapp7 +
                      rapp7b +
                      rapp8t +
                      rapp8 +
                      rapp8b +
                      rapp11t +
                      rapp11 +
                      rapp11b +
                      rapp1t +
                      rapp1 +
                      rapp1b +
                      rapp2t +
                      rapp2 +
                      rapp2b +
                      channelPush +
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

      //client
      const test = {
        client: client,
        db: db,
      };

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
    //check if user is logged in
    if (!req.session.user) {
      const test = {
        client: client,
        db: db,
      };
      res.render("index2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //Files
      function fileWalker(user) {
        var walkSync = function (dir, filelist) {
          var path = path || require("path");
          var fs = fs || require("fs"),
            files = fs.readdirSync(dir);
          filelist = filelist || [];
          files.forEach(function (file) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
              filelist = walkSync(path.join(dir, file), filelist);
            } else {
              filelist.push(`${dir}/${file}`);
            }
          });
          return filelist;
        };

        let fileArray = [];

        let fileCount = 0;

        walkSync("/root/Server/commands").forEach((file) => {
          fileCount++;

          const command = require(`${file}`);

          if (fileCount % 2 == 0) {
            fileArray.push(`
            <button class="collapsible" style="background-color: rgba(0, 255, 255, 0.2);" onclick=\"toggle('${
              command.name
            }')\">
              <div class="textcol">
                ${command.name}
              </div>
            </button>
            <div class="content" style="display: none;" id="${command.name}">
              Category: <h2>${command.category}</h2> <br>
                ${command.explain.replace(/Example/g, "<br><br>Example")}
            </div>
          `);
          } else {
            fileArray.push(`
            <button class="collapsible" onclick=\"toggle('${command.name}')\">
              <div class="textcol">
                ${command.name}
              </div>
            </button>
            <div class="content" style="display: none;" id="${command.name}">
              Category: <h2>${command.category}</h2> <br>
                ${command.explain.replace(/Example/g, "<br><br>Example")}
            </div>
          `);
          }
        });

        return fileArray.join(" ");
      }

      const test = {
        client: client,
        db: db,
      };

      //Render
      res.render("command", {
        page: "command",
        test: test,
        data: fileWalker(req.session.user),
        userInfo: req.session.user,
      });
    }
  });

  ///////////////////
  // leaderboards
  ///////////////////
  //guild ID
  let guildID = [];

  //push guild ID
  client.guilds.cache.map((guild) => guildID.push(guild.id));

  //for each in array
  for (let i of guildID) {
    //
    //loop trough called guild data
    for (const data of getGuild.all(i)) {
      //

      //form render
      app.get("/" + data.guild, (req, res) => {
        //Leaderboard
        function dataLboard() {
          //empty array
          let array = [];

          //scroll trough guild ID

          //get guild
          let gettheguild = client.guilds.cache.get(data.guild);

          //first push
          array.push(
            `<br><button onclick=\"toggle('${
              data.guild
            }')\" class="collapsible">
                <img src ="${gettheguild.iconURL({
                  format: "jpg",
                })}" width="30px" height="30px" style="border-radius: 50%;">
                <div class="textcol">${client.guilds.cache.get(data.guild)} (${
              gettheguild.memberCount
            } Members)</div>
                </button>
                <div class="content" style="display: block;" id="${data.guild}">
                <table width="100%" style="border-collapse: collapse;" align="center">`
          );

          //second counter
          let count2 = 0;

          //select by points
          const leader = db
            .prepare(
              "SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;"
            )
            .all(gettheguild.id);

          //loop trough data
          for (const data2 of leader) {
            //get user data
            let thisss = gettheguild.members.cache.get(data2.user);

            //if user
            if (thisss) {
              //if has more than 5 points
              if (data2.points > 5) {
                //upp counter
                count2++;

                //if even
                if (count2 % 2 == 0) {
                  //second push
                  array.push(`
                      <tr style="text-align:left; border-bottom: 1px solid black"><td style="width: 50%;">(${count2}) 
                      <a href ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                      })}" target="_blank">
                      <img src ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 128,
                      })}" width="20px" height="20px"></a>
                      ${thisss.user.username.replace(/\</g, "&lt;")}
                      </td>
                      <td style="width: 50%;">Level: ${data2.level} | \u058F  ${
                    data2.points
                  }</td></tr>`);
                } else {
                  //second push
                  array.push(`
                      <tr style="text-align:left; border-bottom: 1px solid black; background-color: rgba(60, 255, 0, 0.03);"><td style="width: 50%;">(${count2}) 
                      <a href ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                      })}" target="_blank">
                      <img src ="${thisss.user.avatarURL({
                        format: "png",
                        dynamic: true,
                        size: 128,
                      })}" width="20px" height="20px"></a>
                      ${thisss.user.username.replace(/\</g, "&lt;")}
                      </td>
                      <td style="width: 50%;">Level: ${data2.level} | \u058F  ${
                    data2.points
                  }</td></tr>`);
                }
              }
            }
          }

          //final push
          array.push(`</table></div>`);

          //return array
          return array.join(" ");
        }

        //client
        const test = {
          client: client,
          db: db,
        };

        if (!req.session.user) {
          //Render
          res.render("lb", {
            page: data.guild,
            test: test,
            dataLboard: dataLboard(),
            userInfo: req.session.user,
          });
        } else {
          //Render
          res.render("lb2", {
            page: data.guild,
            test: test,
            dataLboard: dataLboard(),
            userInfo: req.session.user,
          });
        }
      });
    }
  }

  //////////////////
  // control page 2
  //////////////////
  app.get("/control2", (req, res) => {
    //check if user is logged in
    if (!req.session.user) {
      const test = {
        client: client,
        db: db,
      };
      res.render("control2", {
        page: "dashboard",
        test: test,
      });
    } else {
      //control panel
      function dataControl(user) {
        //empty array
        let array = [];

        //empty guild ID
        let gid = [];

        //push guilds into gid
        client.guilds.cache.map((guild) => gid.push(guild.id));

        //loop gid
        for (let i of gid) {
          //loop trough database entries
          for (const data of getLevel.all(i)) {
            //define guild
            let gettheguild = client.guilds.cache.get(data.guild);

            //get user
            let thiss = gettheguild.members.cache.get(user.id);

            //if user exists
            if (thiss) {
              //check if user has certain perms
              let rolec = thiss.permissions.has("KICK_MEMBERS");

              //if no guild owner
              if (!gettheguild.owner) {
              } else {
                //if user is guild owner or has proper perms
                if (
                  gettheguild.owner.id == user.id ||
                  rolec.toString().includes("true")
                ) {
                  //build top part of array
                  let top1 = `<br><button onclick=\"toggle('${
                    data.guild
                  }')\" class="collapsible">
                    <img src ="${gettheguild.iconURL({
                      format: "jpg",
                    })}" width="30px" height="30px" style="border-radius: 50%;">
                    <div class="textcol">${client.guilds.cache.get(
                      data.guild
                    )} (${gettheguild.memberCount} Members)</div></button>
                    <div class="content" id="${data.guild}">
                    <table width="100%" style="border-collapse: collapse;" align="center">`;

                  //build bottom part of array
                  let bot1 = "</table></div>";

                  //1
                  let s1 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl5
                  );
                  if (!s1) {
                    var se1 = "None Set";
                  } else {
                    var se1 = s1.name;
                  }

                  //2
                  let s2 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl10
                  );
                  if (!s2) {
                    var se2 = "None Set";
                  } else {
                    var se2 = s2.name;
                  }

                  //3
                  let s3 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl15
                  );
                  if (!s3) {
                    var se3 = "None Set";
                  } else {
                    var se3 = s3.name;
                  }

                  //4
                  let s4 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl20
                  );
                  if (!s4) {
                    var se4 = "None Set";
                  } else {
                    var se4 = s4.name;
                  }

                  //5
                  let s5 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl30
                  );
                  if (!s5) {
                    var se5 = "None Set";
                  } else {
                    var se5 = s5.name;
                  }

                  //6
                  let s6 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl50
                  );
                  if (!s6) {
                    var se6 = "None Set";
                  } else {
                    var se6 = s6.name;
                  }

                  //7
                  let s7 = gettheguild.roles.cache.find(
                    (r) => r.id === data.lvl85
                  );
                  if (!s7) {
                    var se7 = "None Set";
                  } else {
                    var se7 = s7.name;
                  }

                  //start channel build
                  let channelPush = `
                  <!--//build level 5-->
                    <tr style="text-align:left"><td><br><h2>Set up #Level-up Roles</h2></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 5</td>
                    <td><div id="${data.guild}a1">@${se1}</div></td></tr>

                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td><td>
                    <form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 5</option>
                    <option value="11 ${data.guild} disable">DISABLE</option>
                    
                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="11 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                    </select>
                    <br><input type="submit" id="${
                      data.guild
                    }18" class="button" onclick="notification('Edited:<br>Level 5 role');
                    document.getElementById('${
                      data.guild
                    }18').style.display = 'none'" value="Save">
                    </form></td></tr>
                    

                  <!--//build level 10-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 10</td>
                    <td><div id="${data.guild}a2">@${se2}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 10</option>
                    <option value="12 ${data.guild} disable">DISABLE</option>

                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="12 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }19" class="button" onclick="notification('Edited:<br>Level 10 role');
                    document.getElementById('${
                      data.guild
                    }19').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build level 15-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 15</td>
                    <td><div id="${data.guild}a3">@${se3}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 15</option>
                    <option value="13 ${data.guild} disable">DISABLE</option>
                    
                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="13 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }20" class="button" onclick="notification('Edited:<br>Level 15 role');
                    document.getElementById('${
                      data.guild
                    }20').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build level 20-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 20</td>
                    <td><div id="${data.guild}a4">@${se4}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 20</option>
                    <option value="14 ${data.guild} disable">DISABLE</option>
                   
                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="14 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }21" class="button" onclick="notification('Edited:<br>Level 20 role');
                    document.getElementById('${
                      data.guild
                    }21').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build level 30-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 30</td>
                    <td><div id="${data.guild}a5">@${se5}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 30</option>
                    <option value="15 ${data.guild} disable">DISABLE</option>
                    
                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="15 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }22" class="button" onclick="notification('Edited:<br>Level 30 role');
                    document.getElementById('${
                      data.guild
                    }22').style.display = 'none'" value="Save">
                    </form></td></tr>

                  <!--//build level 50-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 50</td>
                    <td><div id="${data.guild}a6">@${se6}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 50</option>
                    <option value="16 ${data.guild} disable">DISABLE</option>
                    
                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="16 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }23" class="button" onclick="notification('Edited:<br>Level 50 role');
                    document.getElementById('${
                      data.guild
                    }23').style.display = 'none'" value="Save">
                    </form></td></tr>

                    <!--//build 85-->
                    <tr style="text-align:left; border-bottom: 1px solid black"><td>Level 85</td>
                    <td><div id="${data.guild}a7">@${se7}</div></td></tr>
                    <tr style="text-align:left; border-bottom: 1px solid black"><td></td>
                    <td><form action="/" method="post">
                    <select name="data2">
                    <option value="" selected disabled hidden>Choose Level 85</option>
                    <option value="17 ${data.guild} disable">DISABLE</option>
                    
                    ${gettheguild.roles.cache.map(
                      (roles) =>
                        `<option value="17 ${data.guild} ${roles.id}">@${roles.name}</option>`
                    )}

                      </select>
                    <br><input type="submit" id="${
                      data.guild
                    }24" class="button" onclick="notification('Edited:<br>Level 85 role');
                    document.getElementById('${
                      data.guild
                    }24').style.display = 'none'" value="Save">
                    </form></td></tr>
                    `;

                  //Form webpage
                  array.push(top1 + channelPush + bot1 + "\n");
                }
              }
            }
            //
          }
        }
        return array.toString().replace(/,/g, "");
      }

      //client
      const test = {
        client: client,
        db: db,
      };

      //Render
      res.render("control2", {
        page: "control2",
        test: test,
        dataControl: dataControl(req.session.user),
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
      //admin Embed
      function memberEmbed(setting) {
        //form embed
        const embed = new Discord.MessageEmbed()
          .setTitle(`Artemis Web Dashboard`)
          .setDescription(
            `${req.session.user.username} Changed an User setting`
          )
          .addField("Changed: ", `${setting}`)
          .addField("User ID: ", `${req.session.user.id}`)
          .setColor("RANDOM")
          .setTimestamp();

        //send embed
        client.channels.cache.get("701764606053580870").send({
          embed: embed,
        });
      }

      //change data to array
      var data3 = req.body.data3.split(" ");

      //renew db
      getScore2 = db.prepare(
        "SELECT * FROM scores WHERE user = ? AND guild = ? ORDER BY guild DESC"
      );
      setScore2 = db.prepare(
        "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
      );

      //Delete
      if (data3[1] == "ST") {
        let stream = getScore2.get(req.session.user.id, data3[0]);
        if (data3[2] == "DELETE") {
          //here
          db.prepare(
            `DELETE FROM scores WHERE user = '${req.session.user.id}' AND guild = '${data3[0]}'`
          ).run();

          memberEmbed(`Deleted userinfo for guild: ${data3[0]}`);

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
        "INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix, leveling, wmessage) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix, @leveling, @wmessage);"
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
          //admin Embed
          function adminEmbed(guild, setting) {
            //form embed
            const embed = new Discord.MessageEmbed()
              .setTitle(`Artemis Web Dashboard`)
              .setAuthor(
                thiss.user.username,
                thiss.user.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                })
              )
              .setThumbnail(
                thiss.user.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                })
              )
              .setDescription(`${thiss.user.username} Changed an Admin setting`)
              .addField("Changed: ", `${setting}`)
              .addField("In Guild: ", `${guild}`)
              .setColor("RANDOM")
              .setTimestamp();

            //send embed
            client.channels.cache.get("701764606053580870").send({
              embed: embed,
            });
          }

          //General Channel
          if (data2[0] == "1") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.generalChannel = `0`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "General Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let channelstuff = getGuild2.get(data2[1]);

            //set channel
            channelstuff.generalChannel = findme.id;
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "General Channel");
            return res.status(204).send();
          }

          //Log channel
          if (data2[0] == "2") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.logsChannel = `0`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Log Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let channelstuff = getGuild2.get(data2[1]);

            //set channel
            channelstuff.logsChannel = findme.id;
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "Log Channel");
            return res.status(204).send();
          }

          //Mute verify channel
          if (data2[0] == "3") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.muteChannel = `0`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Verify Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let channelstuff = getGuild2.get(data2[1]);

            //set channel
            channelstuff.muteChannel = findme.id;
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "Verify Channel");
            return res.status(204).send();
          }

          //Highlight channel
          if (data2[0] == "4") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.highlightChannel = `0`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Highlight Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let channelstuff = getGuild2.get(data2[1]);

            //set channel
            channelstuff.highlightChannel = findme.id;
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "Highlight Channel");
            return res.status(204).send();
          }

          //Reaction role channel
          if (data2[0] == "5") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.reactionChannel = `0`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Reaction role Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let channelstuff = getGuild2.get(data2[1]);

            //set channel
            channelstuff.reactionChannel = findme.id;
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "Reaction role Channel");
            return res.status(204).send();
          }

          //Stream notification channel
          if (data2[0] == "6") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.streamChannel = `0`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Stream Notification Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let channelstuff = getGuild2.get(data2[1]);

            //set channel
            channelstuff.streamChannel = findme.id;
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "Stream Notification Channel");
            return res.status(204).send();
          }

          //Support main category
          if (data2[0] == "7") {
            //get support channels
            let getSupport2 = db
              .prepare("SELECT * FROM support WHERE gid = ?")
              .all(data2[1]);

            //insert stuff
            let setSupport = db.prepare(
              "INSERT OR REPLACE INTO support (cid, gid, inuse, casenumber, mainchan, inusechan) VALUES (@cid, @gid, @inuse, @casenumber, @mainchan, @inusechan);"
            );

            //if nothing
            if (!getSupport2) return res.status(204).send();

            //if data arg 2 is disable
            if (data2[2] == "disable") {
              //loop trough support2
              for (let i of getSupport2) {
                let getSupport3 = db.prepare(
                  "SELECT * FROM support WHERE cid = ?"
                );
                let testing = getSupport3.get(i.cid);

                testing.mainchan = 0;
                setSupport.run(testing);
              }

              adminEmbed(data2[1], "Stream Notification Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            for (let i of getSupport2) {
              let getSupport3 = db.prepare(
                "SELECT * FROM support WHERE cid = ?"
              );
              let testing = getSupport3.get(i.cid);

              testing.mainchan = findme.id;
              setSupport.run(testing);
            }

            adminEmbed(data2[1], "Support channels MAIN");
            return res.status(204).send();
          }

          //Support in-use category
          if (data2[0] == "8") {
            //get support channels
            let getSupport2 = db
              .prepare("SELECT * FROM support WHERE gid = ?")
              .all(data2[1]);

            //insert stuff
            let setSupport = db.prepare(
              "INSERT OR REPLACE INTO support (cid, gid, inuse, casenumber, mainchan, inusechan) VALUES (@cid, @gid, @inuse, @casenumber, @mainchan, @inusechan);"
            );

            //if nothing
            if (!getSupport2) return res.status(204).send();

            //if data arg 2 is disable
            if (data2[2] == "disable") {
              //loop trough support2
              for (let i of getSupport2) {
                let getSupport3 = db.prepare(
                  "SELECT * FROM support WHERE cid = ?"
                );
                let testing = getSupport3.get(i.cid);

                testing.inusechan = 0;
                setSupport.run(testing);
              }

              adminEmbed(data2[1], "Stream Notification Channel");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.channels.cache.find(
              (channel) => channel.id === data2[2]
            );

            //If no channel
            if (!findme) return res.status(204).send();

            for (let i of getSupport2) {
              let getSupport3 = db.prepare(
                "SELECT * FROM support WHERE cid = ?"
              );
              let testing = getSupport3.get(i.cid);

              testing.inusechan = findme.id;
              setSupport.run(testing);
            }

            adminEmbed(data2[1], "Support channels IN-USE");
            return res.status(204).send();
          }

          //prefix
          if (data2[0] == "pr") {
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.prefix = data2.slice(2).join(" ");
            setGuild.run(channelstuff);
            return res.status(204).send();
          }

          //welcome message
          if (data2[0] == "wm") {
            let channelstuff = getGuild2.get(data2[1]);
            channelstuff.wmessage = data2.slice(2).join(" ");
            setGuild.run(channelstuff);
            adminEmbed(data2[1], "Welcoming message");
            return res.status(204).send();
          }

          //automod
          if (data2[0] == "am") {
            if (data2[2] == "ON") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.autoMod = `2`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Automod");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.autoMod = `1`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Automod");
              return res.status(204).send();
            }
          }

          //leveling
          if (data2[0] == "lv") {
            if (data2[2] == "ON") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.leveling = `1`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Leveling");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.leveling = `2`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Leveling");
              return res.status(204).send();
            }
          }

          //Logs leavejoin
          if (data2[0] == "lj") {
            if (data2[2] == "ON") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.leavejoin = `1`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Logs: Join/Leave message");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.leavejoin = `0`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Logs: Join/Leave message");
              return res.status(204).send();
            }
          }

          //Logs editmsg
          if (data2[0] == "em") {
            if (data2[2] == "ON") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.editmsg = `1`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Logs: Edit message");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.editmsg = `0`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Logs: Edit message");
              return res.status(204).send();
            }
          }

          //Logs deletemsg
          if (data2[0] == "dm") {
            if (data2[2] == "ON") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.deletemsg = `1`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Logs: Delete message");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.deletemsg = `0`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Logs: Delete message");
              return res.status(204).send();
            }
          }

          //bump notifications
          if (data2[0] == "bp") {
            if (data2[2] == "ON") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.bumpping = `0`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Bump Notification");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getSettings.get(data2[1]);
              channelstuff.bumpping = `1`;
              setSettings.run(channelstuff);
              adminEmbed(data2[1], "Bump Notification");
              return res.status(204).send();
            }
          }

          //Extra Options: Artemis Replies
          if (data2[0] == "ar") {
            if (data2[2] == "ON") {
              let channelstuff = getEo.get(data2[1]);
              channelstuff.artreplies = `ON`;
              setEo.run(channelstuff);
              adminEmbed(data2[1], "Extra Options: Artemis Replies");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getEo.get(data2[1]);
              channelstuff.artreplies = `OFF`;
              setEo.run(channelstuff);
              adminEmbed(data2[1], "Extra Options: Artemis Replies");
              return res.status(204).send();
            }
          }

          //streampings
          if (data2[0] == "sh") {
            if (data2[2] == "ON") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.streamHere = `2`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Stream Pings");
              return res.status(204).send();
            }
            if (data2[2] == "OFF") {
              let channelstuff = getGuild2.get(data2[1]);
              channelstuff.streamHere = `1`;
              setGuild.run(channelstuff);
              adminEmbed(data2[1], "Stream Pings");
              return res.status(204).send();
            }
          }

          //level 5
          if (data2[0] == "11") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl5 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl5 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
          }

          //level 10
          if (data2[0] == "12") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl10 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl10 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
          }

          //level 15
          if (data2[0] == "13") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl15 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl15 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
          }

          //level 20
          if (data2[0] == "14") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl20 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl20 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
          }

          //level 30
          if (data2[0] == "15") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl30 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl30 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
          }

          //level 50
          if (data2[0] == "16") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl50 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl50 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
          }

          //level 85
          if (data2[0] == "17") {
            //if data arg 2 is disable
            if (data2[2] == "disable") {
              let rolestuff = getLevel.get(data2[1]);
              rolestuff.lvl85 = `0`;
              setLevel.run(rolestuff);
              adminEmbed(data2[1], "Level Role");
              return res.status(204).send();
            }

            //check if channel exists
            let findme = gettheguild.roles.cache.find((r) => r.id === data2[2]);

            //If no channel
            if (!findme) return res.status(204).send();

            //define channel
            let rolestuff = getLevel.get(data2[1]);

            //set channel
            rolestuff.lvl85 = findme.id;
            setLevel.run(rolestuff);
            adminEmbed(data2[1], "Level Role");
            return res.status(204).send();
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

      //form embed
      const fembed = new Discord.MessageEmbed()
        .setTitle(`Artemis Web Dashboard`)
        .setDescription(`${req.session.user.username} Logged in!`)
        .addField("User ID: ", `${req.session.user.id}`)
        .setColor("RANDOM")
        .setTimestamp();

      //send embed
      client.channels.cache.get("701764606053580870").send({
        embed: fembed,
      });

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
    "/etc/letsencrypt/live/artemis.rest/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/artemis.rest/cert.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/artemis.rest/chain.pem",
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
    //console.log("HTTPS Server running on port 443");
  });

  httpServer.listen(80, () => {
    //console.log("HTTP Server running on port 80");
  });
};
