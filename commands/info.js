const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "info",
  description: "[general] Display server info",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    let inline = true;
    let sicon = message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });
    function convertMS(milliseconds) {
      var day, hour, minute, seconds;
      seconds = Math.floor(milliseconds / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      day = Math.floor(hour / 24);
      hour = hour % 24;
      return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds,
      };
    }
    let timers = convertMS(message.client.uptime);
    let serverembed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(sicon)
      .setAuthor(message.guild.name)
      .addField("Name", message.guild.name, inline)
      .addField("ID", message.guild.id, inline)
      .addField("Owner", message.guild.owner, inline)
      .addField("Region", message.guild.region, inline)
      .addField("Members", `${message.guild.memberCount}`, inline)
      .addField("Roles", message.guild.roles.cache.size, inline)
      .addField("Channels", message.guild.channels.cache.size, inline)
      .addField(
        "Uptime: ",
        "Day [" +
          timers.day +
          "], Hour [" +
          timers.hour +
          "], Minute [" +
          timers.minute +
          "], Seconds [" +
          timers.seconds +
          "]"
      )
      .addField(
        "Ram: ",
        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB"
      )
      .addField("Total servers", message.client.guilds.cache.size)
      .addField("Total users: ", message.client.users.cache.size)
      .addField(
        "You Joined",
        moment
          .utc(message.member.joinedAt)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .setFooter(
        `Created ${moment
          .utc(message.guild.createdAt)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")}`
      );
    message.channel.send(serverembed);
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("info");
    usage.number++;
    setUsage.run(usage);
    //
  },
};
