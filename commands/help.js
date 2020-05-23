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
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("help");
    usage.number++;
    setUsage.run(usage);

    //start stuff

    //exact match
    if (message.content === `${prefix}help mod`) {
      //if user has proper perms
      if (message.member.permissions.has("KICK_MEMBERS")) {
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
          if (command.description.includes(`[mod]`)) {
            let usag = getUsage.get(command.name);
            str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
          }
        }

        //build embed
        let embed = new Discord.MessageEmbed()
          .setColor(`RANDOM`)
          .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
          .setDescription(`${str}`)
          .setTimestamp();

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
    }

    //exact match
    if (message.content === `${prefix}help server`) {
      //if user has proper perms
      if (message.member.permissions.has("KICK_MEMBERS")) {
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
          if (command.description.includes(`[server]`)) {
            let usag = getUsage.get(command.name);
            str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
          }
        }

        //build embed
        let embed = new Discord.MessageEmbed()
          .setColor(`RANDOM`)
          .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
          .setDescription(`${str}`)
          .setTimestamp();

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
    }

    //exact match
    if (message.content === `${prefix}help mscore`) {
      //if user has proper perms
      if (message.member.permissions.has("KICK_MEMBERS")) {
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
          if (command.description.includes(`[mscore]`)) {
            let usag = getUsage.get(command.name);
            str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
          }
        }

        //build embed
        let embed = new Discord.MessageEmbed()
          .setColor(`RANDOM`)
          .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
          .setDescription(`${str}`)
          .setTimestamp();

        //send embed
        return message.channel.send({
          embed: embed,
        });
      }
    }

    //exact match
    if (message.content === `${prefix}help general`) {
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
        if (command.description.includes(`[general]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //exact match
    if (message.content === `${prefix}help level`) {
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
        if (command.description.includes(`[level]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //exact match
    if (message.content === `${prefix}help linux`) {
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
        if (command.description.includes(`[linux]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //exact match
    if (message.content === `${prefix}help fun`) {
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
        if (command.description.includes(`[fun]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //exact match
    if (message.content === `${prefix}help stream`) {
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
        if (command.description.includes(`[stream]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //exact match
    if (message.content === `${prefix}help music`) {
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
        if (command.description.includes(`[music]`)) {
          let usag = getUsage.get(command.name);
          str += `${prefix}${command.name}, \n${command.description} \nCommand used: (${usag.number}) times\n\n`;
        }
      }

      //build embed
      let embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
        .setDescription(`${str}`)
        .setTimestamp();

      //send embed
      return message.channel.send({
        embed: embed,
      });
    }

    //build embed
    let embed2 = new Discord.MessageEmbed()
      .setColor(`RANDOM`)
      .setThumbnail(`https://artemisbot.eu/static/images/artava.png`)
      .setTitle("Pick a category")
      .setDescription(
        "You can report a message by reaction to it with \uD83D\uDEAB \nhaving 3 :tea: reactions to a message will highlight it!\n"
      )
      .addField("Also available on: ", "https://artemisbot.eu")
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
      embed2.addField(`${prefix}help mscore`, "Display score/level commands\n");
    }

    //send embed
    return message.channel.send({
      embed: embed2,
    });
  },
};
