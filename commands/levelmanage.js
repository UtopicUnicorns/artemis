const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "levelmanage",
  description: "[mscore] Manage level up roles",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const getLevel = db.prepare("SELECT * FROM level WHERE guild = ?");
    const setLevel = db.prepare(
      "INSERT OR REPLACE INTO level (guild, lvl5, lvl10, lvl15, lvl20, lvl30, lvl50, lvl85) VALUES (@guild, @lvl5, @lvl10, @lvl15, @lvl20, @lvl30, @lvl50, @lvl85);"
    );
    if (!message.member.hasPermission("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("levelmanage");
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
        if (message.content === `${prefix}levelmanage`) {
          let levelget = getLevel.get(message.guild.id);
          const hellothereguilde = new Discord.MessageEmbed()
            .setTitle("Manage level up role rewards")
            .setColor("RANDOM")
            .addField(
              "Command usage:\n",
              `${prefix}levelmanage lvl05|lvl10|lvl15|lvl20|lvl30|lvl50|lvl85 roleID/roleNAME`
            )
            .addField(
              "Level 5: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl5)
            )
            .addField(
              "Level 10: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl10)
            )
            .addField(
              "Level 15: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl15)
            )
            .addField(
              "Level 20: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl20)
            )
            .addField(
              "Level 30: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl30)
            )
            .addField(
              "Level 50: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl50)
            )
            .addField(
              "Level 85: ",
              message.guild.roles.cache.find((r) => r.id === levelget.lvl85)
            )
            .setTimestamp();
          return message.channel.send({
            embed: hellothereguilde,
          });
        }
        const args = message.content.slice(prefix.length + 12).split(" ");
        if (args[0] == "lvl05") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl5 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 05 has been changed to " + levelcheck
          );
        }
        if (args[0] == "lvl10") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl10 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 10 has been changed to " + levelcheck
          );
        }
        if (args[0] == "lvl15") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl15 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 15 has been changed to " + levelcheck
          );
        }
        if (args[0] == "lvl20") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl20 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 20 has been changed to " + levelcheck
          );
        }
        if (args[0] == "lvl30") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl30 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 30 has been changed to " + levelcheck
          );
        }
        if (args[0] == "lvl50") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl50 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 50 has been changed to " + levelcheck
          );
        }
        if (args[0] == "lvl85") {
          let levelget = getLevel.get(message.guild.id);
          if (!levelget) return message.channel.send("An error has occured!");
          let levelcheck =
            message.guild.roles.cache.find((r) => r.id === args[1]) ||
            message.guild.roles.cache.find((r) => r.name === args[1]);
          if (!levelcheck)
            return message.channel.send(args[1] + " is not a valid role!");
          levelget.lvl85 = levelcheck.id;
          setLevel.run(levelget);
          return message.channel.send(
            "Level up reward for level 85 has been changed to " + levelcheck
          );
        }
      }
    }
  },
};
