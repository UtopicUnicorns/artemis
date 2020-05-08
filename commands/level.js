const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "level",
  description: "[level] Show your points and level",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("level");
    usage.number++;
    setUsage.run(usage);
    //
    let guildChannels2 = getGuild.get(message.guild.id);
    if (guildChannels2) {
      if (guildChannels2.leveling == "2") {
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );
      } else {
        const getScore = db.prepare(
          "SELECT * FROM scores WHERE user = ? AND guild = ?"
        );
        const setScore = db.prepare(
          "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
        );
        let args = message.content.slice(prefix.length + 6).split(" ");
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
        if (!user) return;
        let userscore = getScore.get(user.user.id, message.guild.id);
        if (!userscore)
          return message.reply("This user does not have a database index yet.");
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        setScore.run(userscore);
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
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(
          "./modules/img/mintwelcome.png"
        );
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
          `Level: ${mathlev}\nPoints to next level: ${math3}`,
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
        const guildlogo = await Canvas.loadImage(user.user.displayAvatarURL({ format: 'jpg' }));
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
        ctx.fillText(`${mathpoint} / ${math2} points`, 50, 235);
        const attachment = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "level.png"
          );
        return message.channel.send(attachment);
      }
    }
  },
};
