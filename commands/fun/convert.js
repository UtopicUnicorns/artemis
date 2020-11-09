//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "convert",
  description: "[fun] Convert stuff",
  explain: `This command allows you to convert:

* CM to Inch
* Inch to CM
* Celcius to Fahrenheit
* Fahrenheit to Celcius


Example usage: \`!convert NUM cm\`

Example usage: \`!convert NUM inch\`

Example usage: \`!convert NUM celcius\`

Example usage: \`!convert NUM fahrenheit\``,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("convert");
    usage.number++;
    setUsage.run(usage);

    //args
    let args = message.content.slice(prefix.length + 8).split(" ");

    //Args
    if (args[0]) {
      if (args[1]) {
        //cm
        if (args[1].toLowerCase().includes("cm"))
          return message.reply(`${args[0]} centimeter is ${args[0] * 0.3937}″`);

        //inch
        if (args[1].toLowerCase().includes("i"))
          return message.reply(
            `${args[0]}″  is ${args[0] / 0.3937} centimeter.`
          );

        //cel
        if (args[1].toLowerCase().includes("c"))
          return message.reply(
            `${args[0]}\xB0C is ${Math.floor((args[0] * 9) / 5 + 32)}\xB0F."`
          );

        //fah
        if (args[1].toLowerCase().includes("f"))
          return message.reply(
            `${args[0]}\xB0F is ${Math.floor(((args[0] - 32) * 5) / 9)}\xB0C."`
          );
      }
    }
  },
};
