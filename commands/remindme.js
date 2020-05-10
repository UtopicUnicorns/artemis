const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "remindme",
  description: "[general] set a reminder",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    const getRemind = db.prepare("SELECT * FROM remind WHERE time = ?");
    const setRemind = db.prepare(
      "INSERT OR REPLACE INTO remind (mid, cid, gid, uid, time, reminder) VALUES (@mid, @cid, @gid, @uid, @time, @reminder);"
    );
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("remindme");
    usage.number++;
    setUsage.run(usage);
    //
    const args = message.content.slice(prefix.length + 9).split(" ");
    if (!args[0]) {
      const reminders = db
        .prepare("SELECT * FROM remind WHERE uid = ? ORDER BY time DESC;")
        .all(message.author.id);
      let str = "";
      for (const data of reminders) {
        let guildname = message.client.guilds.cache.get(data.gid);
        let channelname = guildname.channels.cache.find(
          (channel) => channel.id === data.cid
        );
        let timers = data.time;
        str +=
          "\nWhen: " +
          moment(timers, "YYYYMMDDHHmmss").fromNow() +
          "\n" +
          guildname +
          "\n" +
          channelname +
          "\nReminder: " +
          data.reminder +
          "\nDeletion key: " +
          data.mid +
          "\n";
      }
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
        .setTitle("Remindme")
        .setColor(`RANDOM`)
        .setDescription("Reminders:\n" + str)
        .addField(prefix + "remindme ", "10 s reason")
        .addField(prefix + "remindme ", "10 m reason")
        .addField(prefix + "remindme ", "10 h reason")
        .addField(prefix + "remindme ", "delete DELETIONKEY")
        .addField(prefix + "remindme ", "delete clear");
      return message.channel.send({
        embed,
      });
    }
    if (!args[1]) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
        .setTitle("ERROR")
        .setColor(`RANDOM`)
        .setDescription("No time set!")
        .addField(prefix + "remindme ", "10 s reason")
        .addField(prefix + "remindme ", "10 m reason")
        .addField(prefix + "remindme ", "10 h reason")
        .addField(prefix + "remindme ", "delete DELETIONKEY")
        .addField(prefix + "remindme ", "delete clear");
      return message.channel.send({
        embed,
      });
    }
    if (args[0] == "delete") {
      if (args[1] == "clear") {
        try {
          db.prepare(
            `DELETE FROM remind WHERE uid = ${message.author.id}`
          ).run();
        } catch {
          return message.reply("Wrong deletion key, or not owned by you.");
        }
        return message.reply("Done, check " + prefix + "remindme");
      }
      try {
        db.prepare(
          `DELETE FROM remind WHERE mid = ${args[1]} AND uid = ${message.author.id}`
        ).run();
      } catch {
        return message.reply("Wrong deletion key, or not owned by you.");
      }
      return message.reply("Done, check " + prefix + "remindme");
    }
    if (args[1] == "s" || args[1] == "sec" || args[1] == "seconds") {
      let settime = Math.floor(args[0] * 1000);
      let remindtext = args.slice(2).join(" ");
      let datefor = moment().add(settime, "ms").format("YYYYMMDDHHmmss");
      timerset = {
        mid: message.id,
        cid: message.channel.id,
        gid: message.guild.id,
        uid: message.author.id,
        time: datefor,
        reminder: remindtext,
      };
      setRemind.run(timerset);
      return message.reply(
        moment(datefor, "YYYYMMDDHHmmss").format("DD/MM/YYYY H:mm:ss") +
          " " +
          moment(datefor, "YYYYMMDDHHmmss").fromNow()
      );
    }
    if (args[1] == "m" || args[1] == "min" || args[1] == "minutes") {
      let settime = Math.floor(args[0] * 60000);
      let remindtext = args.slice(2).join(" ");
      let datefor = moment().add(settime, "ms").format("YYYYMMDDHHmmss");
      timerset = {
        mid: message.id,
        cid: message.channel.id,
        gid: message.guild.id,
        uid: message.author.id,
        time: datefor,
        reminder: remindtext,
      };
      setRemind.run(timerset);
      return message.reply(
        moment(datefor, "YYYYMMDDHHmmss").format("DD/MM/YYYY H:mm:ss") +
          " " +
          moment(datefor, "YYYYMMDDHHmmss").fromNow()
      );
    }
    if (args[1] == "h" || args[1] == "hour" || args[1] == "hours") {
      let settime = Math.floor(args[0] * 3600000);
      let remindtext = args.slice(2).join(" ");
      let datefor = moment().add(settime, "ms").format("YYYYMMDDHHmmss");
      timerset = {
        mid: message.id,
        cid: message.channel.id,
        gid: message.guild.id,
        uid: message.author.id,
        time: datefor,
        reminder: remindtext,
      };
      setRemind.run(timerset);
      return message.reply(
        moment(datefor, "YYYYMMDDHHmmss").format("DD/MM/YYYY H:mm:ss") +
          " " +
          moment(datefor, "YYYYMMDDHHmmss").fromNow()
      );
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
      .setTitle("UNSUPPORTED FORMAT")
      .setColor(`RANDOM`)
      .setDescription("No time set!")
      .addField(prefix + "remindme ", "10 s reason")
      .addField(prefix + "remindme ", "10 m reason")
      .addField(prefix + "remindme ", "10 h reason")
      .addField(prefix + "remindme ", "delete DELETIONKEY")
      .addField(prefix + "remindme ", "delete clear");
    return message.channel.send({
      embed,
    });
  },
};
