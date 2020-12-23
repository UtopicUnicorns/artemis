//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "pokeid",
  description: "[fun] See your poke info",
  explain: `Follow the pokedex's instructions`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("pokeid");
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

    //pull user from database
    let userscore = getScore.get(message.author.id, message.guild.id);

    //if no entry
    if (!userscore) return message.reply("You are not known yet..");

    //get pokemon count and pokemons in array
    let pokeGet = db.prepare("SELECT * FROM pokemon").all();
    let pokeCount = 0;
    let pokeCaught = [];

    //loop trough array
    pokeGet.forEach((h) => {
      let splittPokemon = h.trainerpokemon.split("-");
      if (splittPokemon[0] == message.author.id) {
        pokeCount++;
        pokeCaught.push(`./modules/img/pokemon/${splittPokemon[1]}.png`);
      }
    });

    let randoSelect = pokeCaught[~~(Math.random() * pokeCaught.length)];

    //Rounder borders
    function roundedImage(x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    //Create canvas
    const canvas = Canvas.createCanvas(855, 635);
    const ctx = canvas.getContext("2d");

    //Background
    var background = await Canvas.loadImage(`./modules/img/pokedex.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Text
    ctx.font = "15px sans-serif";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "end";
    ctx.fillText(
      `${message.author.username.toUpperCase()}
\u058F${userscore.points}
${trainerGet.pokeballs} Pokeballs
${trainerGet.greatballs} Greatballs
${trainerGet.ultraballs} Ultraballs
${trainerGet.masterballs} Masterballs`,
      550,
      75
    );
    ctx.font = "25px sans-serif";
    ctx.shadowBlur = 1;
    ctx.fillText(`Pokemon caught: ${pokeCount}`, 570, 400);

    if (randoSelect) {
      var rand = await Canvas.loadImage(randoSelect);
      ctx.drawImage(rand, 300, 400, 200, 200);
    }

    //Avatar
    roundedImage(273, 45, 125, 125, 5);
    ctx.clip();
    const img = await Canvas.loadImage(
      message.author.displayAvatarURL({ format: "png" })
    );
    ctx.drawImage(img, 273, 45, 125, 125);

    //make attachment
    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "pokeid.png"
    );

    //send first message
    message.channel.send(``, attachment);

    //wait for user reply
    let pokeId = message.channel.createMessageCollector(
      (m) => m.author.id === message.author.id
    );

    //if user responds
    pokeId.on("collect", async (m) => {
      //args
      let args = m.content.toLowerCase().split(" ");

      pokeId.stop();
    });
  },
};
