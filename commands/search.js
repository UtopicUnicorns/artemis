//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "search",
  description: "[general] Search the internet",
  explain: `Using this command allows you to search the internet from a command.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("search");
    usage.number++;
    setUsage.run(usage);

    //form args
    let args = message.content.slice(prefix.length + 7);

    //joke
    if (args.toLowerCase() == "how many days does june have?") {
      //form embed
      let embed = new Discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setThumbnail(
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setTitle(`Search results for: ${args.slice(0, 20)}`)
        .setColor("RANDOM")
        .addField(
          "\u200b",
          "[Monthly Calendar - June 2020 Calendar](https://www.timeanddate.com/calendar/monthly.html)\nDuration Between Two Dates – Calculates number of days. Date Calculator – Add or subtract days, months, years; Birthday Calculator - June has 31 days..."
        )
        .addField(
          "\u200b",
          "[How many days are in the month of June? | Study.com](https://study.com/academy/answer/how-many-days-are-in-the-month-of-june.html)\nSummer officially begins on June 21st each year, but how many days does the month of June have all together? - June ends on june 31..."
        )
        .addField(
          "\u200b",
          "[Months - Math is Fun](https://www.mathsisfun.com/measure/months.html)\n30 days has September, April and November. All the rest have 31. Except February alone, Which has 28 days clear. And 29 in each leap year."
        )
        .addField(
          "\u200b",
          "[June - Wikipedia](https://en.wikipedia.org/wiki/June)\nJune is the sixth month of the year in the Julian and Gregorian calendars, the second of four months to have a length of 31 days, and the third of five months to ..."
        )
        .addField(
          "\u200b",
          "[Which Months Have 31 Days? - Date Calculator](https://www.datecalculator.org/which-months-have-31-days)\nm 8 and i want to be 18 how do i use this calculater? ... Why is a month defined as 30 days when so many more months have 31 days, ... 30 days has September April and November all the rest have 31 apart from February which has 28."
        );

      //send embed
      return message.channel.send({ embed });
    }

    //google start
    googleIt({ query: args, disableConsole: true }).then((results) => {
      //form embed
      let embed = new Discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setThumbnail(
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setTitle(`Search results for: ${args.slice(0, 20)}`)
        .setColor("RANDOM");

      //build counter
      let count = 0;

      //loop trough results
      for (let i of results) {
        //define stuff
        let a = i.title;
        let b = i.link;
        let c = i.snippet.slice(0, 150);

        //up counter
        count++;

        //if 5 return
        if (count < 6)
          embed.addField(`\u200b`, `${count}. [${a}](${b})\n${c}...`);
      }

      //send embed
      message.channel.send({ embed });
    });
  },
};
