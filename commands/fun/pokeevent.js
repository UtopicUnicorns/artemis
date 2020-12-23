//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

GrassRec = new Set();

//start
module.exports = {
  category: `fun`,
  name: "pokeevent",
  description: "[fun] Get free pokeballs",
  explain: `Play this event to get some free pokeballs`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("pokeevent");
    usage.number++;
    setUsage.run(usage);

    //init trainer
    let trainerGet = getTrainer.get(message.author.id);

    if (!trainerGet) {
      trainerGet = {
        trainerid: message.author.id,
        pokeballs: 5,
        greatballs: 0,
        ultraballs: 0,
        masterballs: 0,
      };
      setTrainer.run(trainerGet);

      return message.reply(
        `Welcome new trainer!
        You got 5 pokeballs to start with.\n
        ${prefix}pokehunt
        ${prefix}pokeshop
        ${prefix}pokeid
        ${prefix}pokeevent`
      );
    }

    if (GrassRec.has(message.author.id))
      return message.reply(
        "You can only walk around in the tall grass every 10 minutes!"
      );

    GrassRec.add(message.author.id);

    //delete user from list after half a second
    setTimeout(() => {
      GrassRec.delete(message.author.id);
    }, 600000);

    const canvas = Canvas.createCanvas(258, 195);
    const ctx = canvas.getContext("2d");

    var background = await Canvas.loadImage(`./modules/img/tallgrass.jpeg`);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "tallgrass.png"
    );

    //send first message
    message.channel.send(
      `You are walking in the tall grass.
    \`Go Left\`
    \`Go Right\`
    \`Go Forward\`
    \`Go Backwards\``,
      attachment
    );

    //wait for user reply
    let pokeGrass = message.channel.createMessageCollector(
      (m) => m.author.id === message.author.id
    );

    //if user responds
    pokeGrass.on("collect", async (m) => {
      //random numbewr
      let RandomNumber = Math.floor(Math.random() * 100);

      if (
        RandomNumber == 25 ||
        RandomNumber == 0 ||
        RandomNumber == 50 ||
        RandomNumber == 75
      ) {
        //masterball
        trainerGet.masterballs = Math.floor(
          parseInt(trainerGet.masterballs) + parseInt(1)
        );
        setTrainer.run(trainerGet);

        //stop collecting
        pokeGrass.stop();

        //reply
        return message.reply("You have gotten 1 MasterBall!");
      }

      if (
        RandomNumber == 10 ||
        RandomNumber == 20 ||
        RandomNumber == 30 ||
        RandomNumber == 40 ||
        RandomNumber == 50 ||
        RandomNumber == 60 ||
        RandomNumber == 70 ||
        RandomNumber == 80 ||
        RandomNumber == 90
      ) {
        //ultraball
        trainerGet.ultraballs = Math.floor(
          parseInt(trainerGet.ultraballs) + parseInt(2)
        );
        setTrainer.run(trainerGet);

        //stop collecting
        pokeGrass.stop();

        //reply
        return message.reply("You have gotten 2 UltraBalls!");
      }

      if (
        RandomNumber == 3 ||
        RandomNumber == 6 ||
        RandomNumber == 9 ||
        RandomNumber == 12 ||
        RandomNumber == 15 ||
        RandomNumber == 18 ||
        RandomNumber == 21 ||
        RandomNumber == 24 ||
        RandomNumber == 27 ||
        RandomNumber == 33 ||
        RandomNumber == 36 ||
        RandomNumber == 39 ||
        RandomNumber == 42 ||
        RandomNumber == 45 ||
        RandomNumber == 48 ||
        RandomNumber == 51 ||
        RandomNumber == 54 ||
        RandomNumber == 57 ||
        RandomNumber == 63 ||
        RandomNumber == 66 ||
        RandomNumber == 69 ||
        RandomNumber == 72 ||
        RandomNumber == 78 ||
        RandomNumber == 81 ||
        RandomNumber == 84 ||
        RandomNumber == 87 ||
        RandomNumber == 93 ||
        RandomNumber == 96 ||
        RandomNumber == 99
      ) {
        //greatball
        trainerGet.greatballs = Math.floor(
          parseInt(trainerGet.greatballs) + parseInt(3)
        );
        setTrainer.run(trainerGet);

        //stop collecting
        pokeGrass.stop();

        //reply
        return message.reply("You have gotten 3 GreatBalls!");
      }

      trainerGet.pokeballs = Math.floor(
        parseInt(trainerGet.pokeballs) + parseInt(5)
      );
      setTrainer.run(trainerGet);

      //stop collecting
      pokeGrass.stop();

      //reply
      return message.reply("You have gotten 5 PokeBalls!!");
    });
  },
};
