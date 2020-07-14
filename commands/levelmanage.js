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
        //levelget
        let levelget = getLevel.get(message.guild.id);

        //if no args or wrong args
        const hellothereguilde = new Discord.MessageEmbed()
          .setTitle("Manage level up role rewards")
          .setColor("RANDOM")
          .setDescription("Change this on https://artemisbot.eu")
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
