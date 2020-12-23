//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "pokehunt",
  description: "[fun] Catch a Pokemon!",
  explain: `Initiate a Pokemon hunt with !pokehunt.
  Then reply to this message with: 
\`use pokeball\`, \`use greatball\`, \`use ultraball\` or \`use masterball\`

To try to catch!`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("pokehunt");
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

    //pokelist
    pokelist = [
      "Bulbasaur",
      "Ivysaur",
      "Venusaur",
      "Charmander",
      "Charmeleon",
      "Charizard",
      "Squirtle",
      "Wartortle",
      "Blastoise",
      "Caterpie",
      "Metapod",
      "Butterfree",
      "Weedle",
      "Kakuna",
      "Beedrill",
      "Pidgey",
      "Pidgeotto",
      "Pidgeot",
      "Rattata",
      "Raticate",
      "Spearow",
      "Fearow",
      "Ekans",
      "Arbok",
      "Pikachu",
      "Raichu",
      "Sandshrew",
      "Sandslash",
      "Nidoran♀",
      "Nidorina",
      "Nidoqueen",
      "Nidoran♂",
      "Nidorino",
      "Nidoking",
      "Clefairy",
      "Clefable",
      "Vulpix",
      "Ninetales",
      "Jigglypuff",
      "Wigglytuff",
      "Zubat",
      "Golbat",
      "Oddish",
      "Gloom",
      "Vileplume",
      "Paras",
      "Parasect",
      "Venonat",
      "Venomoth",
      "Diglett",
      "Dugtrio",
      "Meowth",
      "Persian",
      "Psyduck",
      "Golduck",
      "Mankey",
      "Primeape",
      "Growlithe",
      "Arcanine",
      "Poliwag",
      "Poliwhirl",
      "Poliwrath",
      "Abra",
      "Kadabra",
      "Alakazam",
      "Machop",
      "Machoke",
      "Machamp",
      "Bellsprout",
      "Weepinbell",
      "Victreebel",
      "Tentacool",
      "Tentacruel",
      "Geodude",
      "Graveler",
      "Golem",
      "Ponyta",
      "Rapidash",
      "Slowpoke",
      "Slowbro",
      "Magnemite",
      "Magneton",
      "Farfetch’d",
      "Doduo",
      "Dodrio",
      "Seel",
      "Dewgong",
      "Grimer",
      "Muk",
      "Shellder",
      "Cloyster",
      "Gastly",
      "Haunter",
      "Gengar",
      "Onix",
      "Drowzee",
      "Hypno",
      "Krabby",
      "Kingler",
      "Voltorb",
      "Electrode",
      "Exeggcute",
      "Exeggutor",
      "Cubone",
      "Marowak",
      "Hitmonlee",
      "Hitmonchan",
      "Lickitung",
      "Koffing",
      "Weezing",
      "Rhyhorn",
      "Rhydon",
      "Chansey",
      "Tangela",
      "Kangaskhan",
      "Horsea",
      "Seadra",
      "Goldeen",
      "Seaking",
      "Staryu",
      "Starmie",
      "Mr. Mime",
      "Scyther",
      "Jynx",
      "Electabuzz",
      "Magmar",
      "Pinsir",
      "Tauros",
      "Magikarp",
      "Gyarados",
      "Lapras",
      "Ditto",
      "Eevee",
      "Vaporeon",
      "Jolteon",
      "Flareon",
      "Porygon",
      "Omanyte",
      "Omastar",
      "Kabuto",
      "Kabutops",
      "Aerodactyl",
      "Snorlax",
      "Articuno",
      "Zapdos",
      "Moltres",
      "Dratini",
      "Dragonair",
      "Dragonite",
      "Mewtwo",
      "Mew",
      "Chikorita",
      "Bayleef",
      "Meganium",
      "Cyndaquil",
      "Quilava",
      "Typhlosion",
      "Totodile",
      "Croconaw",
      "Feraligatr",
      "Sentret",
      "Furret",
      "Hoothoot",
      "Noctowl",
      "Ledyba",
      "Ledian",
      "Spinarak",
      "Ariados",
      "Crobat",
      "Chinchou",
      "Lanturn",
      "Pichu",
      "Cleffa",
      "Igglybuff",
      "Togepi",
      "Togetic",
      "Natu",
      "Xatu",
      "Mareep",
      "Flaaffy",
      "Ampharos",
      "Bellossom",
      "Marill",
      "Azumarill",
      "Sudowoodo",
      "Politoed",
      "Hoppip",
      "Skiploom",
      "Jumpluff",
      "Aipom",
      "Sunkern",
      "Sunflora",
      "Yanma",
      "Wooper",
      "Quagsire",
      "Espeon",
      "Umbreon",
      "Murkrow",
      "Slowking",
      "Misdreavus",
      "Unown",
      "Wobbuffet",
      "Girafarig",
      "Pineco",
      "Forretress",
      "Dunsparce",
      "Gligar",
      "Steelix",
      "Snubbull",
      "Granbull",
      "Qwilfish",
      "Scizor",
      "Shuckle",
      "Heracross",
      "Sneasel",
      "Teddiursa",
      "Ursaring",
      "Slugma",
      "Magcargo",
      "Swinub",
      "Piloswine",
      "Corsola",
      "Remoraid",
      "Octillery",
      "Delibird",
      "Mantine",
      "Skarmory",
      "Houndour",
      "Houndoom",
      "Kingdra",
      "Phanpy",
      "Donphan",
      "Porygon2",
      "Stantler",
      "Smeargle",
      "Tyrogue",
      "Hitmontop",
      "Smoochum",
      "Elekid",
      "Magby",
      "Miltank",
      "Blissey",
      "Raikou",
      "Entei",
      "Suicune",
      "Larvitar",
      "Pupitar",
      "Tyranitar",
      "Lugia",
      "Ho-Oh",
      "Celebi",
      "Treecko",
      "Grovyle",
      "Sceptile",
      "Torchic",
      "Combusken",
      "Blaziken",
      "Mudkip",
      "Marshtomp",
      "Swampert",
      "Poochyena",
      "Mightyena",
      "Zigzagoon",
      "Linoone",
      "Wurmple",
      "Silcoon",
      "Beautifly",
      "Cascoon",
      "Dustox",
      "Lotad",
      "Lombre",
      "Ludicolo",
      "Seedot",
      "Nuzleaf",
      "Shiftry",
      "Taillow",
      "Swellow",
      "Wingull",
      "Pelipper",
      "Ralts",
      "Kirlia",
      "Gardevoir",
      "Surskit",
      "Masquerain",
      "Shroomish",
      "Breloom",
      "Slakoth",
      "Vigoroth",
      "Slaking",
      "Nincada",
      "Ninjask",
      "Shedinja",
      "Whismur",
      "Loudred",
      "Exploud",
      "Makuhita",
      "Hariyama",
      "Azurill",
      "Nosepass",
      "Skitty",
      "Delcatty",
      "Sableye",
      "Mawile",
      "Aron",
      "Lairon",
      "Aggron",
      "Meditite",
      "Medicham",
      "Electrike",
      "Manectric",
      "Plusle",
      "Minun",
      "Volbeat",
      "Illumise",
      "Roselia",
      "Gulpin",
      "Swalot",
      "Carvanha",
      "Sharpedo",
      "Wailmer",
      "Wailord",
      "Numel",
      "Camerupt",
      "Torkoal",
      "Spoink",
      "Grumpig",
      "Spinda",
      "Trapinch",
      "Vibrava",
      "Flygon",
      "Cacnea",
      "Cacturne",
      "Swablu",
      "Altaria",
      "Zangoose",
      "Seviper",
      "Lunatone",
      "Solrock",
      "Barboach",
      "Whiscash",
      "Corphish",
      "Crawdaunt",
      "Baltoy",
      "Claydol",
      "Lileep",
      "Cradily",
      "Anorith",
      "Armaldo",
      "Feebas",
      "Milotic",
      "Castform",
      "Kecleon",
      "Shuppet",
      "Banette",
      "Duskull",
      "Dusclops",
      "Tropius",
      "Chimecho",
      "Absol",
      "Wynaut",
      "Snorunt",
      "Glalie",
      "Spheal",
      "Sealeo",
      "Walrein",
      "Clamperl",
      "Huntail",
      "Gorebyss",
      "Relicanth",
      "Luvdisc",
      "Bagon",
      "Shelgon",
      "Salamence",
      "Beldum",
      "Metang",
      "Metagross",
      "Regirock",
      "Regice",
      "Registeel",
      "Latias",
      "Latios",
      "Kyogre",
      "Groudon",
      "Rayquaza",
      "Jirachi",
      "Deoxys",
    ];

    //define pics
    const photos = fs.readdirSync("./modules/img/pokemon");

    //empty array
    const array = [];

    //loop trough photos
    for (const file of photos) {
      //push into array
      array.push(file);
    }

    const randomPoke = array[~~(Math.random() * array.length)];
    //build canvas
    const canvas = Canvas.createCanvas(900, 582);
    const ctx = canvas.getContext("2d");

    var background = await Canvas.loadImage(`./modules/img/grass.jpeg`);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      "./modules/img/pokemon/" + randomPoke
    );
    ctx.drawImage(avatar, 350, 200, 400, 400);

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "poke.png"
    );

    //replace ext with number
    let selPoke = randomPoke.replace(".png", "");

    //pokemon name
    let namePoke = pokelist[parseInt(selPoke) - 1];

    let randomFail = [
      `LOL ${namePoke} consumed itself!`,
      `${namePoke} decided that you were not worth its time.`,
      `You caught ${namePoke}, wait you didn't, seems like you caught a riceball.`,
      `You decided to throw your ball at full speed! ${namePoke} died. oh no..`,
      `A random Pokemon came along and ate ${namePoke}.`,
      `${namePoke} decided to beat you up and left your corpse all bloodied and blue behind.`,
      `${namePoke} ran away.`,
    ];

    let randomFailSel = randomFail[~~(Math.random() * randomFail.length)];

    //send first message
    message.channel.send(
      `You encounter a ${namePoke} (#${randomPoke.replace(".png", "")})!

      You have ${trainerGet.pokeballs} Pokeballs (1/15 chance).
      You have ${trainerGet.greatballs} Greatballs (1/10 chance).
      You have ${trainerGet.ultraballs} Ultraballs (1/5 chance).
      You have ${trainerGet.masterballs} Masterballs (1/1 chance).

Reply to this message with: 
\`use pokeball\`, \`use greatball\`, \`use ultraball\` or \`use masterball\`
    `,
      attachment
    );

    //wait for user reply
    let pokeCol = message.channel.createMessageCollector(
      (m) => m.author.id === message.author.id
    );

    //if user responds
    pokeCol.on("collect", async (m) => {
      //switch
      switch (m.content.toLowerCase()) {
        case "use pokeball":
          //safe
          if (trainerGet.pokeballs == 0) {
            pokeCol.stop();
            return message.reply("You do not have any pokeballs dummy!");
          }

          //Reply first
          message.reply(`Used Pokeball on ${namePoke}!`);

          //reduce balls
          trainerGet.pokeballs--;
          setTrainer.run(trainerGet);

          //Create random numbers
          let rNum = Math.floor(Math.random() * 15);
          let rNum2 = Math.floor(Math.random() * 15);

          //check if number matches
          if (rNum2 == rNum) {
            //reply
            message.reply(`You caught ${namePoke}!`);

            //catch
            let catchp1 = getPokemon.get(
              `${message.author.id}-${randomPoke.replace(".png", "")}`
            );

            if (!catchp1) {
              catchp1 = {
                trainerpokemon: `${message.author.id}-${randomPoke.replace(
                  ".png",
                  ""
                )}`,
                level: 1,
              };
              setPokemon.run(catchp1);
            } else {
              catchp1.level++;
              setPokemon.run(catchp1);

              message.reply(
                `You already had ${namePoke}, so you fed this to your pokemon who now leveled to level ${catchp1.level}!`
              );
            }
          } else {
            //reply
            message.reply(`${randomFailSel}`);
          }

          break;

        case "use greatball":
          //safe
          if (trainerGet.greatballs == 0) {
            pokeCol.stop();
            return message.reply("You do not have any greatballs dummy!");
          }

          //Reply first
          message.reply(`Used Greatball on ${namePoke}!`);

          //reduce balls
          trainerGet.greatballs--;
          setTrainer.run(trainerGet);

          //Create random numbers
          let rNumm = Math.floor(Math.random() * 10);
          let rNumm2 = Math.floor(Math.random() * 10);

          //check if number matches
          if (rNumm2 == rNumm) {
            //reply
            message.reply(`You caught ${namePoke}!`);

            //catch
            let catchp2 = getPokemon.get(
              `${message.author.id}-${randomPoke.replace(".png", "")}`
            );

            if (!catchp2) {
              catchp2 = {
                trainerpokemon: `${message.author.id}-${randomPoke.replace(
                  ".png",
                  ""
                )}`,
                level: 1,
              };
              setPokemon.run(catchp2);
            } else {
              catchp2.level++;
              setPokemon.run(catchp2);

              message.reply(
                `You already had ${namePoke}, so you fed this to your pokemon who now leveled to level ${catchp2.level}!`
              );
            }
          } else {
            //reply
            message.reply(`${randomFailSel}`);
          }

          break;

        case "use ultraball":
          //safe
          if (trainerGet.ultraballs == 0) {
            pokeCol.stop();
            return message.reply("You do not have any ultraballs dummy!");
          }

          //Reply first
          message.reply(`Used Ultraball on ${namePoke}!`);

          //reduce balls
          trainerGet.ultraballs--;
          setTrainer.run(trainerGet);

          //Create random numbers
          let rNummm = Math.floor(Math.random() * 5);
          let rNummm2 = Math.floor(Math.random() * 5);

          //check if number matches
          if (rNummm2 == rNummm) {
            //reply
            message.reply(`You caught ${namePoke}!`);

            //catch
            let catchp3 = getPokemon.get(
              `${message.author.id}-${randomPoke.replace(".png", "")}`
            );

            if (!catchp3) {
              catchp3 = {
                trainerpokemon: `${message.author.id}-${randomPoke.replace(
                  ".png",
                  ""
                )}`,
                level: 1,
              };
              setPokemon.run(catchp3);
            } else {
              catchp3.level++;
              setPokemon.run(catchp3);

              message.reply(
                `You already had ${namePoke}, so you fed this to your pokemon who now leveled to level ${catchp3.level}!`
              );
            }
          } else {
            //reply
            message.reply(`${randomFailSel}`);
          }

          break;

        case "use masterball":
          //safe
          if (trainerGet.masterballs == 0) {
            pokeCol.stop();
            return message.reply("You do not have any masterballs dummy!");
          }

          //Reply first
          message.reply(`Used Masterball on ${namePoke}!`);

          //reduce balls
          trainerGet.masterballs--;
          setTrainer.run(trainerGet);

          //Create random numbers
          let rNummmm = 1;
          let rNummmm2 = 1;

          //check if number matches
          if (rNummmm2 == rNummmm) {
            //reply
            message.reply(`You caught ${namePoke}!`);

            //catch
            let catchp4 = getPokemon.get(
              `${message.author.id}-${randomPoke.replace(".png", "")}`
            );

            if (!catchp4) {
              catchp4 = {
                trainerpokemon: `${message.author.id}-${randomPoke.replace(
                  ".png",
                  ""
                )}`,
                level: 1,
              };
              setPokemon.run(catchp4);
            } else {
              catchp4.level++;
              setPokemon.run(catchp4);

              message.reply(
                `You already had ${namePoke}, so you fed this to your pokemon who now leveled to level ${catchp4.level}!`
              );
            }
          } else {
            //reply
            message.reply(`${randomFailSel}`);
          }

          break;

        default:
          //reply
          message.reply(`${namePoke} ran away.`);

          break;
      }

      pokeCol.stop();
    });
  },
};
