//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "pokeshop",
  description: "[fun] Shop pokemon balls!",
  explain: `Follow the shops instructions`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("pokeshop");
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

    const canvas = Canvas.createCanvas(1138, 600);
    const ctx = canvas.getContext("2d");

    var background = await Canvas.loadImage(`./modules/img/pokeshop.jpeg`);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "pokeshop.png"
    );

    //send first message
    message.channel.send(
      `\`\`\`diff
+ Welcome to the PokeShop!
- \`You have \u058F${userscore.points}.\`

+ Items
-   You have ${trainerGet.pokeballs} Pokeballs (1/15 chance).
-   You have ${trainerGet.greatballs} Greatballs (1/10 chance).
-   You have ${trainerGet.ultraballs} Ultraballs (1/5 chance).
-   You have ${trainerGet.masterballs} Masterballs (1/1 chance).

+ Costs
-   Pokeball \u058F20
-   Greatball \u058F100
-   Ultraball \u058F250

+ How to purchase
- In your next message say:
    greatball 10
OR
    ultraball 2
OR
    pokeball 1

- The first argument is the ball you want to purchase, the second is the amount.
        \`\`\``,
      attachment
    );

    //wait for user reply
    let pokeShop = message.channel.createMessageCollector(
      (m) => m.author.id === message.author.id
    );

    //if user responds
    pokeShop.on("collect", async (m) => {
      //args
      let args = m.content.toLowerCase().split(" ");

      if (!args) {
        pokeShop.stop();
        return message.reply("See you next time!");
      }

      if (!args[0]) {
        pokeShop.stop();
        return message.reply("See you next time!");
      }

      if (!args[1]) {
        pokeShop.stop();
        return message.reply("See you next time!");
      }

      if (isNaN(args[1])) {
        pokeShop.stop();
        return message.reply("See you next time!");
      }

      if (args[1] == "0") {
        pokeShop.stop();
        return message.reply("See you next time!");
      }

      if (args[0] == "pokeball") {
        let pokeMath = Math.floor(20 * args[1]);
        let pokeMath1 = Math.floor(userscore.points - pokeMath);
        if (pokeMath1 < 1) {
          pokeShop.stop();
          return message.reply("You are not rich enough for this!");
        }

        userscore.points = pokeMath1;
        setScore.run(userscore);

        trainerGet.pokeballs = Math.floor(
          parseInt(trainerGet.pokeballs) + parseInt(args[1])
        );
        setTrainer.run(trainerGet);

        message.reply(
          `You have ${trainerGet.pokeballs} Pokeballs (1/15 chance).
You have ${trainerGet.greatballs} Greatballs (1/10 chance).
You have ${trainerGet.ultraballs} Ultraballs (1/5 chance).
You have ${trainerGet.masterballs} Masterballs (1/1 chance).

Your new balance is \`\u058F${userscore.points}\`.
You purchased ${args[1]} Pokeball(s).

Thanks for shopping with us!`
        );
      }

      if (args[0] == "greatball") {
        let greatMath = Math.floor(100 * args[1]);
        let greatMath1 = Math.floor(userscore.points - greatMath);
        if (greatMath1 < 1) {
          pokeShop.stop();
          return message.reply("You are not rich enough for this!");
        }

        userscore.points = greatMath1;
        setScore.run(userscore);

        trainerGet.greatballs = Math.floor(
          parseInt(trainerGet.greatballs) + parseInt(args[1])
        );
        setTrainer.run(trainerGet);

        message.reply(
          `You have ${trainerGet.pokeballs} Pokeballs (1/15 chance).
You have ${trainerGet.greatballs} Greatballs (1/10 chance).
You have ${trainerGet.ultraballs} Ultraballs (1/5 chance).
You have ${trainerGet.masterballs} Masterballs (1/1 chance).

Your new balance is \`\u058F${userscore.points}\`.
You purchased ${args[1]} Greatball(s).

Thanks for shopping with us!`
        );
      }

      if (args[0] == "ultraball") {
        let ultraMath = Math.floor(250 * args[1]);
        let ultraMath1 = Math.floor(userscore.points - ultraMath);
        if (ultraMath1 < 1) {
          pokeShop.stop();
          return message.reply("You are not rich enough for this!");
        }

        userscore.points = ultraMath1;
        setScore.run(userscore);

        trainerGet.ultraballs = Math.floor(
          parseInt(trainerGet.ultraballs) + parseInt(args[1])
        );
        setTrainer.run(trainerGet);

        message.reply(
          `You have ${trainerGet.pokeballs} Pokeballs (1/15 chance).
You have ${trainerGet.greatballs} Greatballs (1/10 chance).
You have ${trainerGet.ultraballs} Ultraballs (1/5 chance).
You have ${trainerGet.masterballs} Masterballs (1/1 chance).

Your new balance is \`\u058F${userscore.points}\`.
You purchased ${args[1]} Ultraball(s).

Thanks for shopping with us!`
        );
      }

      //trainerGet.pokeballs--;
      //setTrainer.run(trainerGet);

      pokeShop.stop();
    });
  },
};
