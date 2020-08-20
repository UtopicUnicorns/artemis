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
  use \`help COMMANDNAME\` to see more information on the command`,
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

    if (args[0]) {
      return comExp(args[0]);
    }

    //arrays
    const general = [];
    const linux = [];
    const level = [];
    const fun = [];
    const stream = [];
    const music = [];
    const mod = [];
    const server = [];
    const mscore = [];

    //define commands
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    //loop trough commands
    for (const file of commandFiles) {
      //define command
      const command = require(`./${file}`);

      //general
      if (command.description.includes(`[general]`)) {
        let usag = getUsage.get(command.name);
        general.push(
          `$$$$$General
          ${prefix}${command.name}
            ${command.description.replace(`[general]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //linux
      if (command.description.includes(`[linux]`)) {
        let usag = getUsage.get(command.name);
        linux.push(
          `$$$$$Linux
          ${prefix}${command.name}
            ${command.description.replace(`[linux]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //level
      if (command.description.includes(`[level]`)) {
        let usag = getUsage.get(command.name);
        level.push(
          `$$$$$Level
          ${prefix}${command.name}
            ${command.description.replace(`[level]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //fun
      if (command.description.includes(`[fun]`)) {
        let usag = getUsage.get(command.name);
        fun.push(
          `$$$$$Fun
          ${prefix}${command.name}
            ${command.description.replace(`[fun]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //stream
      if (command.description.includes(`[stream]`)) {
        let usag = getUsage.get(command.name);
        stream.push(
          `$$$$$Stream
          ${prefix}${command.name}
            ${command.description.replace(`[stream]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //music
      if (command.description.includes(`[music]`)) {
        let usag = getUsage.get(command.name);
        music.push(
          `$$$$$Music
          ${prefix}${command.name}
            ${command.description.replace(`[music]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //mod
      if (command.description.includes(`[mod]`)) {
        let usag = getUsage.get(command.name);
        mod.push(
          `$$$$$Mod
          ${prefix}${command.name}
            ${command.description.replace(`[mod]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //server
      if (command.description.includes(`[server]`)) {
        let usag = getUsage.get(command.name);
        server.push(
          `$$$$$Server
          ${prefix}${command.name}
            ${command.description.replace(`[server]`, ``)}
            Command used: (${usag.number}) times`
        );
      }

      //mscore
      if (command.description.includes(`[mscore]`)) {
        let usag = getUsage.get(command.name);
        mscore.push(
          `$$$$$M-Score
          ${prefix}${command.name}
            ${command.description.replace(`[mscore]`, ``)}
            Command used: (${usag.number}) times`
        );
      }
    }

    //index array
    const index = [];

    //index
    index.push(
      `$$$$$INDEX
        🔂: Index 
        🇦: General 
        🇧: Linux 
        🇨: Level 
        🇩: Fun
        🇪: Music 
        🇫: Stream 
        🇬: Mod
        🇭: Server
        🇮: M-Score
        \`You can use the letter shortcuts under this message!\``
    );

    //join arrays
    let str = [];
    str.push(index.join(" "));
    str.push(general.join(" "));
    str.push(linux.join(" "));
    str.push(level.join(" "));
    str.push(fun.join(" "));
    str.push(music.join(" "));
    str.push(stream.join(" "));
    str.push(mod.join(" "));
    str.push(server.join(" "));
    str.push(mscore.join(" "));

    /**
     * Creates an embed with guilds starting from an index.
     * @param {number} start The index to start from.
     */

    //generateFunction
    const generateEmbed = (start) => {
      const current = str.slice(start, start + 1);

      //form embed
      const embed = new Discord.MessageEmbed()
        .setDescription(
          "Having 3 :tea: reactions to a message will highlight it!"
        )
        .addField("Also available on: ", "https://artemisbot.eu")
        .setColor(`RANDOM`)
        .setThumbnail(
          message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setFooter(`Hit the arrow buttons to scroll trough the pages`)
        .setTimestamp();

      //loop trough current
      for (let i of current.join(" ").split("$$$$$")) {
        let help = i.split("\n");
        if (help[0].includes("INDEX")) {
          embed.setTitle(`Category: ${help[0]}`);
          if (help[0].length > 1) embed.addField(`Help Categories`, `${i}`);
        } else {
          embed.setTitle(`Category: ${help[0]}`);
          if (help[0].length > 1)
            embed.addField(`${help[1]}`, `${help[2]} \n ${help[3]}`);
        }
      }

      return embed;
    };

    //Respond to author
    const author = message.author;

    //Send first page
    message.channel.send(generateEmbed(0)).then((message) => {
      //iff below 1
      if (str.length <= 1) return;

      //react with arrow
      message
        .react("🔂")
        .then(() => message.react("🇦"))
        .then(() => message.react("🇧"))
        .then(() => message.react("🇨"))
        .then(() => message.react("🇩"))
        .then(() => message.react("🇪"))
        .then(() => message.react("🇫"))
        .then(() => message.react("🇬"))
        .then(() => message.react("🇭"))
        .then(() => message.react("🇮"));

      //form collector
      const collector = message.createReactionCollector(
        //Respond to author
        (reaction, user) =>
          ["🔂", "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"].includes(
            reaction.emoji.name
          ) && user.id === author.id,

        //timeout
        { time: 3000000 }
      );

      //current page
      let currentIndex = 0;

      //on message
      collector.on("collect", async (m) => {
        //stop collecting
        if (m.content) collector3.stop();
      });

      //on collect
      collector.on("collect", (reaction) => {
        //Remove reaction
        reaction.users.remove(author.id);

        //index shoot
        if (reaction.emoji.name === "🔂") currentIndex = 0;
        if (reaction.emoji.name === "🇦") currentIndex = 1;
        if (reaction.emoji.name === "🇧") currentIndex = 2;
        if (reaction.emoji.name === "🇨") currentIndex = 3;
        if (reaction.emoji.name === "🇩") currentIndex = 4;
        if (reaction.emoji.name === "🇪") currentIndex = 5;
        if (reaction.emoji.name === "🇫") currentIndex = 6;
        if (reaction.emoji.name === "🇬") currentIndex = 7;
        if (reaction.emoji.name === "🇭") currentIndex = 8;
        if (reaction.emoji.name === "🇮") currentIndex = 9;

        //edit message with new embed
        message.edit(generateEmbed(currentIndex));
      });
    });
  },
};
