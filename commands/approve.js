//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "approve",
  description: "[mod] Force a user trough verification",
  explain: `Force approve a member trough the verification process.
  You can use either \`approve @mention\` or \`approve userID\``,
  async execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //form guild channels
    const guildChannels = getGuild.get(message.guild.id);

    //form mute channel
    var generalChannel1 = message.guild.channels.cache.get(
      guildChannels.generalChannel
    );

    //form mute channel
    var muteChannel1 = message.guild.channels.cache.get(
      guildChannels.muteChannel
    );

    if (!muteChannel1) return message.reply("No mute/verify channel set up!");

    if (!generalChannel1)
      return message.reply("No welcome/general channel set up!");

    //update usage
    usage = getUsage.get("approve");
    usage.number++;
    setUsage.run(usage);

    //fetch role
    let roleadd = message.guild.roles.cache.find((r) => r.name === "~/Members");

    //def args
    let args = message.content.slice(prefix.length + 8).split(" ");

    //define member
    if (message.guild.members.cache.get(args[0])) {
      var user = message.guild.members.cache.get(args[0]);
    }
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      var user = message.guild.members.cache.get(
        message.mentions.users.first().id
      );
    }

    if (!user) return message.reply("Mention a user!");

    //check account age
    var cdate = moment.utc(user.user.createdTimestamp).format("YYYYMMDD");
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");

    //if there is the role
    if (roleadd) {
      setTimeout(async () => {
        await user.roles.add(roleadd).catch(console.error);
      }, 10000);
    }

    //build image
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");
    const background = await Canvas.loadImage("./modules/img/mintwelcome.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.font = "30px Zelda";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(user.user.username, canvas.width / 3.0, canvas.height / 2.0);
    ctx.font = "21px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      "\nAccount age: " + ageA.join(" ") + "\nID: " + user.user.id,
      canvas.width / 3.0,
      canvas.height / 2.0
    );
    const avatar = await Canvas.loadImage(
      user.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      })
    );
    ctx.drawImage(avatar, 600, 25, 50, 50);
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const guildlogo = await Canvas.loadImage(
      message.guild.iconURL({
        format: "png",
        dynamic: true,
        size: 1024,
      })
    );
    ctx.drawImage(guildlogo, 25, 25, 200, 200);
    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "welcome-image.png"
    );

    //load wmessage
    const wmessageStart = getGuild.get(message.guild.id);
    const wmessage = wmessageStart.wmessage;

    //If no message set
    if (!wmessage) {
      //send just a member call
      var sMessage = `${user}`;
    } else {
      var sMessage = `${user},\n ${wmessage}`;
    }

    //send image
    try {
      await generalChannel1.send(sMessage.slice(0, 2000), attachment);
    } catch {
      message.reply("Failed to load cavas, but user should be approved!");
    }

    //block mute channel
    let channel = message.guild.channels.cache.find(
      (channel) => channel.id === muteChannel1.id
    );
    if (channel.permissionOverwrites.get(user.user.id)) {
      await channel.permissionOverwrites.get(user.user.id).delete();
    }

    //notify user
    return message.channel.send(`${user} has been approved.`);
  },
};
