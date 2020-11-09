//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "fbi",
  description: "[fun] Harmless fun",
  explain: `This will show a random wanted poster for yourself, or the user you specify.

Example usage: \`!fbi\`

Example usage: \`!fbi @mention\``,
  async execute(message) {
    //start prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("fbi");
    usage.number++;
    setUsage.run(usage);

    //define user
    let args = message.content.slice(prefix.length + 4).split(" ");
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

    //delete message
    message.delete();

    //image select
    let selectthis = [
      "./modules/img/wanted1.png",
      "./modules/img/wanted2.png",
      "./modules/img/wanted3.png",
      "./modules/img/wanted4.png",
      "./modules/img/wanted5.png",
    ];

    //pick image
    let selectedthis = selectthis[~~(Math.random() * selectthis.length)];

    //make image
    const canvas = Canvas.createCanvas(645, 545);
    const ctx = canvas.getContext("2d");

    //Make background
    const background = await Canvas.loadImage(selectedthis);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Report Name
    ctx.font = "48px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(user.user.username, 322, 165);

    //Avatar shot
    const userImage = await Canvas.loadImage(
      user.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
    );
    ctx.drawImage(userImage, 222, 225, 200, 200);

    //photo effect
    const poeff = await Canvas.loadImage("./modules/img/eff.png");
    ctx.drawImage(poeff, 222, 225, 200, 200);

    //nickname
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(user.user.username + ", " + user.nickname, 48, 452);

    //user creation date
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(
      moment
        .utc(user.user.createdTimestamp)
        .format("dddd, MMMM Do YYYY, HH:mm:ss"),
      118,
      468
    );

    //pleb
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText("pleb", 38, 519);

    //current discord guild name
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.fillText(message.guild.name, 67, 535);

    //save image
    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "wanted.png"
    );

    //send image
    return message.channel.send(attachment);

    //next
  },
};
