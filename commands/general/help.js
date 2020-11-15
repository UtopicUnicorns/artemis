//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `general`,
  name: "help",
  description: "[general] Displays all available commands",
  explain: `This command will show the user a help menu which is only controllable by the user who called for it.
It will show every command available, sorted into categories.
Users can also have a command explained by adding the command's name to the help command.

Example usage: \`!help\`

Example usage: \`!help rolemanage\` _This will explain the command named rolemanage_`,
  async execute(message) {
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

    //EXPERIMENT
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

    var walkSync = function (dir, filelist) {
      var path = path || require("path");
      var fs = fs || require("fs"),
        files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = walkSync(path.join(dir, file), filelist);
        } else {
          filelist.push(`${dir}/${file}`);
        }
      });
      return filelist;
    };

    //loop trough command names and push into arrays
    for (let file of walkSync("commands")) {
      //calling the command
      const command = require(`../../${file}`);

      //Switch cases are nice
      switch (command.category) {
        case "general":
          let usag = getUsage.get(command.name);
          general.push(
            `$$$$$General
          ${prefix}${command.name}
            ${command.description.replace(`[general]`, ``)}
            Command used: (${usag.number}) times`
          );
          break;

        case "linux":
          let usag2 = getUsage.get(command.name);
          linux.push(
            `$$$$$Linux
          ${prefix}${command.name}
            ${command.description.replace(`[linux]`, ``)}
            Command used: (${usag2.number}) times`
          );
          break;

        case "level":
          let usag1 = getUsage.get(command.name);
          level.push(
            `$$$$$Level
          ${prefix}${command.name}
            ${command.description.replace(`[level]`, ``)}
            Command used: (${usag1.number}) times`
          );
          break;

        case "fun":
          let usag3 = getUsage.get(command.name);
          fun.push(
            `$$$$$Fun
          ${prefix}${command.name}
            ${command.description.replace(`[fun]`, ``)}
            Command used: (${usag3.number}) times`
          );
          break;

        case "stream":
          let usag4 = getUsage.get(command.name);
          stream.push(
            `$$$$$Stream
          ${prefix}${command.name}
            ${command.description.replace(`[stream]`, ``)}
            Command used: (${usag4.number}) times`
          );
          break;

        case "music":
          let usag5 = getUsage.get(command.name);
          music.push(
            `$$$$$Music
          ${prefix}${command.name}
            ${command.description.replace(`[music]`, ``)}
            Command used: (${usag5.number}) times`
          );
          break;

        case "mod":
          let usag6 = getUsage.get(command.name);
          mod.push(
            `$$$$$Mod
          ${prefix}${command.name}
            ${command.description.replace(`[mod]`, ``)}
            Command used: (${usag6.number}) times`
          );
          break;

        case "server":
          let usag7 = getUsage.get(command.name);
          server.push(
            `$$$$$Server
          ${prefix}${command.name}
            ${command.description.replace(`[server]`, ``)}
            Command used: (${usag7.number}) times`
          );
          break;

        case "mscore":
          let usag8 = getUsage.get(command.name);
          mscore.push(
            `$$$$$M-Score
          ${prefix}${command.name}
            ${command.description.replace(`[mscore]`, ``)}
            Command used: (${usag8.number}) times`
          );
          break;
      }
    }

    //return console.log(server);

    //start explain
    if (args[0]) {
      return walkSync("commands").forEach((file) => {
        //Call command
        const command = require(`../../${file}`);

        //if err
        if (command.name === args[0].toLowerCase()) {
          if (!command.explain) return message.reply("No explanation found.");

          //build embed
          let embed = new Discord.MessageEmbed()
            .setTitle(command.name)
            .setColor(`RANDOM`)
            .setThumbnail(
              message.guild.iconURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setDescription(command.explain.replace(/!/g, `${prefix}`))
            .setFooter(`Category: ${command.category}\n`)
            .setTimestamp();

          //send embed
          return message.channel.send({
            embed: embed,
          });
        }
      });
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
        .addField("Also available on: ", "https://artemis.rest")
        .setColor(`RANDOM`)
        .setThumbnail(
          message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setFooter(
          `Select the reaction coresponding to the letters in teh list to select a category`
        )
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
