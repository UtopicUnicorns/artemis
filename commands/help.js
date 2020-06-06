//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "help",
  description: "[general] Displays all available commands",
  explain: `This command will show you every command available to you.\n
  use \`help category\`\nor \`help explain COMMANDNAME\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("help");
    usage.number++;
    setUsage.run(usage);

    //def args
    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 5)
      .split(" ");

    //start explain function
    async function comExp(commandExp) {
      //call command
      if (fs.existsSync(`./commands/${commandExp}.js`)) {
        var command = require(`./${commandExp}.js`);

        //if err
        if (!command) return message.reply("Command not found!");
        if (!command.explain) return message.reply("No explanation found.");

        //build embed
        let embed = new Discord.MessageEmbed()
          .setTitle(commandExp)
          .setColor(`RANDOM`)
          .setThumbnail(
            message.guild.iconURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setDescription(command.explain)
          .setTimestamp();

        //send embed
        return message.channel.send({
          embed: embed,
        });
      } else {
        return message.reply("Command not found!");
      }
    }

    //start category function
    async function comArg(commandArg) {
      //empty field
      let str = "";

      //define commands
      const commandFiles = fs
        .readdirSync("./commands")
        .filter((file) => file.endsWith(".js"));

      //loop trough commands
      for (const file of commandFiles) {
        //define command
        const command = require(`./${file}`);
        if (command.description.includes(`[${commandArg}]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description.replace(
            `[${commandArg}]`,
            ``
          )} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //no str
      if (!str) return message.reply("Help category not found!");

      //build embed
      let embed = new Discord.MessageEmbed()
        .setTitle(commandArg)
        .setColor(`RANDOM`)
        .setThumbnail(
          message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //If no arguments
    if (!args[0]) {
      //build embed
      let embed2 = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(
          message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setTitle("Pick a category")
        .setDescription(
          "Having 3 :tea: reactions to a message will highlight it!\n"
        )
        .addField("Also available on: ", "https://artemisbot.eu")
        .addField(
          `${prefix}help explain \`commandName\``,
          "Will explain a command"
        )
        .addField(`${prefix}help general`, "Display General help\n")
        .addField(`${prefix}help linux`, "Display linux based commands\n")
        .addField(`${prefix}help level`, "Display level/score/role commands\n")
        .addField(`${prefix}help fun`, "Display Fun commands\n")
        .addField(`${prefix}help stream`, "Display stream related commands\n")
        .addField(`${prefix}help music`, "Display music help\n");

      //if user has proper perms
      if (message.member.permissions.has("KICK_MEMBERS")) {
        embed2.addField(`${prefix}help mod`, "Display Mod commands\n");
        embed2.addField(`${prefix}help server`, "Display server commands\n");
        embed2.addField(
          `${prefix}help mscore`,
          "Display score/level commands\n"
        );
      }

      //send embed
      return message.channel.send({
        embed: embed2,
      });
    } else {
      //if explain
      if (args[0] == "explain" && args[1]) return comExp(args[1]);

      //call function
      comArg(args[0]);
    }
  },
};
