//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "levelmanage",
  description: "[mscore] Manage level up roles",
  explain: `This command allows you to set up level role rewards.\n
  \`levelmanage lvl05 RoleName/RoleID\`\n
  \`levelmanage lvl10 RoleName/RoleID\`\n
  \`levelmanage lvl15 RoleName/RoleID\`\n
  \`levelmanage lvl20 RoleName/RoleID\`\n
  \`levelmanage lvl30 RoleName/RoleID\`\n
  \`levelmanage lvl50 RoleName/RoleID\`\n
  \`levelmanage lvl85 RoleName/RoleID\`\n`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("levelmanage");
    usage.number++;
    setUsage.run(usage);

    //define guild channels
    let guildChannels2 = getGuild.get(message.guild.id);

    //if guild is in database
    if (guildChannels2) {
      //if leveling is off for this guild
      if (guildChannels2.leveling == "2") {
        //joke reply
        return message.reply(
          "You have to purchase Artemisbot Premium for this feature!\nJust kidding, your guild owner probably disabled leveling."
        );

        //if leveling is on
      } else {
        //form args
        const args = message.content.slice(prefix.length + 12).split(" ");

        //levelget
        let levelget = getLevel.get(message.guild.id);

        //exact match
        if (args[0] == "lvl05") {
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

        //exact match
        if (args[0] == "lvl10") {
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

        //exact match
        if (args[0] == "lvl15") {
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

        //exact match
        if (args[0] == "lvl20") {
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

        //exact match
        if (args[0] == "lvl30") {
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

        //exact match
        if (args[0] == "lvl50") {
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

        //exact match
        if (args[0] == "lvl85") {
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

        //if no args or wrong args
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

        //send embed
        return message.channel.send({
          embed: hellothereguilde,
        });
      }
    }
  },
};
