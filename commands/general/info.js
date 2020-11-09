//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "info",
  description: "[general] Display server info",
  explain: `This command will show the user detailed information about the guild/server they are in.

Example usage: \`!info\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("info");
    usage.number++;
    setUsage.run(usage);

    //inline
    let inline = true;

    //guild ICON
    let sicon = message.guild.iconURL({
      format: "png",
      dynamic: true,
      size: 1024,
    });

    //array
    let inver = [];

    //get leveling
    let levelthing = getGuild.get(message.guild.id);

    //proccess leveling
    if (levelthing.leveling == "2") {
      var levelstat = "OFF";
    } else {
      var levelstat = "ON";
    }

    //process stream pings
    if (levelthing.streamHere == "2") {
      var streamstat = "ON";
    } else {
      var streamstat = "OFF";
    }

    //process automod
    if (levelthing.autoMod == "2") var autostat = "ON";
    if (levelthing.autoMod == "1" || "0") var autostat = "OFF";
    if (levelthing.autoMod == "strict") var autostat = "strict";

    //get invites
    await message.guild.fetchInvites().then((invites) => {
      for (let i of invites) {
        if (i[1].maxAge == "0") inver.push(i[0]);
      }
    });

    if (!inver[0]) {
      var letInvite = "No Active Permanent Invite.";
    } else {
      var letInvite = `https://discord.com/invite/${inver[0]}`;
    }

    //levelget
    let levelget = getLevel.get(message.guild.id);

    //for membed
    let serverembed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(sicon)
      .setAuthor(message.guild.name, sicon)
      .addField("Guild name", message.guild.name, inline)
      .addField("ID", message.guild.id, inline)
      .addField("Owner", message.guild.owner, inline)
      .addField(
        "Default Role",
        message.guild.roles.cache.find((r) => r.id === levelthing.defaultrole),
        inline
      )
      .addField("Region", message.guild.region, inline)
      .addField("Members", `${message.guild.memberCount}`, inline)
      .addField("Roles", message.guild.roles.cache.size, inline)
      .addField(
        "Channels",
        `💬: ${
          message.guild.channels.cache.filter(
            (channel) => channel.type === "text"
          ).size
        } 🔈: ${
          message.guild.channels.cache.filter(
            (channel) => channel.type === "voice"
          ).size
        } `,
        inline
      )
      .addField("Guild Invite: ", letInvite, inline)
      .addField("Autmod mode: ", autostat, inline)
      .addField("Stream Pings: ", streamstat, inline)
      .addField("Leveling: ", levelstat, inline)
      .addField(
        "Channels: ",
        `
        Welcome:
        ${message.guild.channels.cache.find(
          (channel) => channel.id === levelthing.generalChannel
        )}

        Mute/Verify:
        ${message.guild.channels.cache.find(
          (channel) => channel.id === levelthing.muteChannel
        )}

        Logs:
        ${message.guild.channels.cache.find(
          (channel) => channel.id === levelthing.logsChannel
        )}

        Highlights:
        ${message.guild.channels.cache.find(
          (channel) => channel.id === levelthing.highlightChannel
        )}

        Reaction Roles:
        ${message.guild.channels.cache.find(
          (channel) => channel.id === levelthing.reactionChannel
        )}

       Stream: 
        ${message.guild.channels.cache.find(
          (channel) => channel.id === levelthing.streamChannel
        )}
      `,
        inline
      )
      .addField(
        "Level Roles:",
        `
            5:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl5)}

            10:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl10)}

            15:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl15)}

            20:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl20)}

            30:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl30)}

            50:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl50)}

            85:
            ${message.guild.roles.cache.find((r) => r.id === levelget.lvl85)}
          
      `,
        inline
      )

      .setFooter(
        `This guild was created at ${moment
          .utc(message.guild.createdAt)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")}`
      );

    //send embed
    message.channel.send(serverembed);
  },
};
