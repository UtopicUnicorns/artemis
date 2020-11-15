//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `level`,
  name: "level",
  description: "[level] Show your points and level",
  explain: `This command will show a neat graphic card with level/points info, as well as warnings, for the user who uses this command.
You can also specify it further by providing an userID or @mention.

Example usage: \`!level\`

Example usage: \`!level @mention\`

Example usage: \`!level userID\`

Example usage: \`!level set IMAGEURL\`

Example usage: \`!level unset\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("level");
    usage.number++;
    setUsage.run(usage);

    //build guildchannels
    let guildChannels2 = getGuild.get(message.guild.id);

    //if guild is in database
    if (guildChannels2) {
      //if leveling is disabled on guild
      if (guildChannels2.leveling == "2") {
        //joke reply
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );

        //if leveling is enabled
      } else {
        //define args
        let args = message.content.slice(prefix.length + 6).split(" ");

        //delete message
        message.delete();

        //set
        if (args[0].toLowerCase() == "set") {
          //if no URL
          if (!args[1]) return message.reply("Please provide an image URL");

          imageSet = {
            userid: message.author.id,
            img: args[1],
          };

          //run database
          setCIMG.run(imageSet);

          //return and reply
          return message.reply("Custom image has been set!");
        }

        //unset
        if (args[0].toLowerCase() == "unset") {
          //Delete entry
          db.prepare(
            `DELETE FROM cimg WHERE userid = ${message.author.id}`
          ).run();

          //return and reply
          return message.reply("Your custom image has been unset!");
        }

        //define user
        if (!args[0]) {
          var user = message.guild.members.cache.get(message.author.id);
        }
        if (message.guild.members.cache.get(args[0])) {
          var user = message.guild.members.cache.get(args[0]);
        }
        if (args[0].startsWith("<@") && args[0].endsWith(">")) {
          var user = message.guild.members.cache.get(
            message.mentions.users.first().id
          );
        }

        //if removed
        if (args[0] == "id") {
          //if no args 2
          if (!args[1]) return message.reply("Please provide an user ID");

          //pull user from database
          let userscore = getScore.get(args[1], message.guild.id);

          //if no entry
          if (!userscore)
            return message.reply(
              "This user does not have a database index yet."
            );

          //math
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);

          //more math
          let mathlev = userscore.level;
          let mathpoint = userscore.points;
          let mathwarn = userscore.warning;
          let math0 = Math.floor(Math.pow(mathlev, 2) * 4);
          let math1 = Math.floor(mathlev + 1);
          let math2 = Math.floor(Math.pow(math1, 2) * 4);
          let math3 = Math.floor(math2 - mathpoint);
          let math4 = Math.floor(math2 / math3);
          let math5 = Math.floor(((mathpoint - math0) / (math2 - math0)) * 100);
          let math6 = Math.floor((700 / 100) * math5);

          //build canvas
          const canvas = Canvas.createCanvas(700, 250);
          const ctx = canvas.getContext("2d");
          const background = await Canvas.loadImage(
            "./modules/img/level_card.png"
          );
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          ctx.font = "30px sans-serif";
          ctx.shadowColor = "black";
          ctx.shadowBlur = 5;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(`${args[1]}`, 175, 100);
          ctx.font = "25px sans-serif";
          ctx.shadowColor = "black";
          ctx.shadowBlur = 5;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(
            `Level: ${mathlev}\nCash to next level: \u058F ${math3.toLocaleString()}`,
            175,
            135
          );
          if (mathwarn > 0) {
            const avatar = await Canvas.loadImage("./modules/img/alert.png");
            ctx.drawImage(avatar, 600, 150, 50, 50);
            ctx.font = "30px sans-serif";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 5;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(mathwarn, 650, 175);
          }
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 200, 700, 50);
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = "green";
          ctx.fillRect(0, 200, math6, 50);
          ctx.font = "25px sans-serif";
          ctx.shadowColor = "black";
          ctx.shadowBlur = 5;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(
            `\u058F ${mathpoint.toLocaleString()} / \u058F ${math2.toLocaleString()}`,
            50,
            235
          );
          const attachment = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "level.png"
          );

          //send image
          return message.channel.send(attachment);
        }

        //if no user
        if (!user) return;

        //pull user from database
        let userscore = getScore.get(user.user.id, message.guild.id);

        //if no entry
        if (!userscore)
          return message.reply("This user does not have a database index yet.");

        //math
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        setScore.run(userscore);

        //more math
        let mathlev = userscore.level;
        let mathpoint = userscore.points;
        let mathwarn = userscore.warning;
        let math0 = Math.floor(Math.pow(mathlev, 2) * 4);
        let math1 = Math.floor(mathlev + 1);
        let math2 = Math.floor(Math.pow(math1, 2) * 4);
        let math3 = Math.floor(math2 - mathpoint);
        let math4 = Math.floor(math2 / math3);
        let math5 = Math.floor(((mathpoint - math0) / (math2 - math0)) * 100);
        let math6 = Math.floor((700 / 100) * math5);

        //build canvas
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");

        //custom image
        let customIMG = getCIMG.get(user.user.id);

        if (!customIMG) {
          var background = await Canvas.loadImage(
            "./modules/img/level_card.png"
          );
        } else {
          try {
            var background = await Canvas.loadImage(`${customIMG.img}`);
          } catch (error) {
            var background = await Canvas.loadImage(
              "./modules/img/level_card.png"
            );
          }
        }

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = "30px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(user.user.username, 175, 100);
        ctx.font = "25px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          `Level: ${mathlev}\nCash to next level: \u058F ${math3.toLocaleString()}`,
          175,
          135
        );
        if (mathwarn > 0) {
          const avatar = await Canvas.loadImage("./modules/img/alert.png");
          ctx.drawImage(avatar, 600, 150, 50, 50);
          ctx.font = "30px sans-serif";
          ctx.shadowColor = "black";
          ctx.shadowBlur = 5;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(mathwarn, 650, 175);
        }
        const guildlogo = await Canvas.loadImage(
          user.user.displayAvatarURL({ format: "jpg" })
        );
        ctx.drawImage(guildlogo, 50, 75, 100, 100);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 200, 700, 50);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "green";
        ctx.fillRect(0, 200, math6, 50);
        ctx.font = "25px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          `\u058F ${mathpoint.toLocaleString()} / \u058F ${math2.toLocaleString()}`,
          50,
          235
        );
        const attachment = new Discord.MessageAttachment(
          canvas.toBuffer(),
          "level.png"
        );

        //send image
        return message.channel.send(attachment);
      }
    }
  },
};
