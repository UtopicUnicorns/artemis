//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  onGuildMemberAdd: async function (guildMember) {
    //ignore bots
    if (guildMember.user.bot) return;

    //filter
    let filter = [
      "🅿🆄🆂🆂🆈",
      "4r5e",
      "5h1t",
      "5hit",
      "a55",
      "anal",
      "anus",
      "ar5e",
      "arrse",
      "arse",
      "ass",
      "ass-fucker",
      "asses",
      "assfucker",
      "assfukka",
      "asshole",
      "assholes",
      "asswhole",
      "a_s_s",
      "b!tch",
      "b00bs",
      "b17ch",
      "b1tch",
      "ballbag",
      "balls",
      "ballsack",
      "bastard",
      "beastial",
      "beastiality",
      "bellend",
      "bestial",
      "bestiality",
      "bi+ch",
      "biatch",
      "bitch",
      "bitcher",
      "bitchers",
      "bitches",
      "bitchin",
      "bitching",
      "blow job",
      "blowjob",
      "blowjobs",
      "boiolas",
      "bollock",
      "bollok",
      "boner",
      "boob",
      "boobs",
      "booobs",
      "boooobs",
      "booooobs",
      "booooooobs",
      "breasts",
      "buceta",
      "bunny fucker",
      "butt",
      "butthole",
      "buttmuch",
      "buttplug",
      "c0ck",
      "c0cksucker",
      "carpet muncher",
      "cawk",
      "chink",
      "cipa",
      "cl1t",
      "clit",
      "clitoris",
      "clits",
      "cnut",
      "cock",
      "cock-sucker",
      "cockface",
      "cockhead",
      "cockmunch",
      "cockmuncher",
      "cocks",
      "cocksuck",
      "cocksucked",
      "cocksucker",
      "cocksucking",
      "cocksucks",
      "cocksuka",
      "cocksukka",
      "cok",
      "cokmuncher",
      "coksucka",
      "coon",
      "cox",
      "crap",
      "cum",
      "cummer",
      "cumming",
      "cums",
      "cumshot",
      "cunilingus",
      "cunillingus",
      "cunnilingus",
      "cunt",
      "cuntlick",
      "cuntlicker",
      "cuntlicking",
      "cunts",
      "cyalis",
      "cyberfuc",
      "cyberfuck",
      "cyberfucked",
      "cyberfucker",
      "cyberfuckers",
      "cyberfucking",
      "d1ck",
      "dick",
      "dickhead",
      "dildo",
      "dildos",
      "dink",
      "dinks",
      "dirsa",
      "dlck",
      "dog-fucker",
      "doggin",
      "dogging",
      "donkeyribber",
      "doosh",
      "duche",
      "dyke",
      "ejaculate",
      "ejaculated",
      "ejaculates",
      "ejaculating",
      "ejaculatings",
      "ejaculation",
      "ejakulate",
      "f u c k",
      "f u c k e r",
      "f4nny",
      "fag",
      "fagging",
      "faggitt",
      "faggot",
      "faggs",
      "fagot",
      "fagots",
      "fags",
      "fanny",
      "fannyflaps",
      "fannyfucker",
      "fanyy",
      "fatass",
      "fcuk",
      "fcuker",
      "fcuking",
      "feck",
      "fecker",
      "felching",
      "fellate",
      "fellatio",
      "fingerfuck",
      "fingerfucked",
      "fingerfucker",
      "fingerfuckers",
      "fingerfucking",
      "fingerfucks",
      "fistfuck",
      "fistfucked",
      "fistfucker",
      "fistfuckers",
      "fistfucking",
      "fistfuckings",
      "fistfucks",
      "flange",
      "fook",
      "fooker",
      "fuck",
      "fucka",
      "fucked",
      "fucker",
      "fuckers",
      "fuckhead",
      "fuckheads",
      "fuckin",
      "fucking",
      "fuckings",
      "fuckingshitmotherfucker",
      "fuckme",
      "fucks",
      "fuckwhit",
      "fuckwit",
      "fudge packer",
      "fudgepacker",
      "fuk",
      "fuker",
      "fukker",
      "fukkin",
      "fuks",
      "fukwhit",
      "fukwit",
      "fux",
      "fux0r",
      "f_u_c_k",
      "gangbang",
      "gangbanged",
      "gangbangs",
      "gaylord",
      "gaysex",
      "goatse",
      "God",
      "god-dam",
      "god-damned",
      "goddamn",
      "goddamned",
      "hardcoresex",
      "heshe",
      "hoar",
      "hoare",
      "hoer",
      "homo",
      "hore",
      "horniest",
      "horny",
      "hotsex",
      "hitler",
      "jack-off",
      "jackoff",
      "jerk-off",
      "jism",
      "jiz",
      "jizm",
      "jizz",
      "kawk",
      "knob",
      "knobead",
      "knobed",
      "knobend",
      "knobhead",
      "knobjocky",
      "knobjokey",
      "kock",
      "kondum",
      "kondums",
      "kum",
      "kummer",
      "kumming",
      "kums",
      "kunilingus",
      "l3i+ch",
      "l3itch",
      "labia",
      "lmfao",
      "lust",
      "lusting",
      "m0f0",
      "m0fo",
      "m45terbate",
      "ma5terb8",
      "ma5terbate",
      "masochist",
      "master-bate",
      "masterb8",
      "masterbat*",
      "masterbat3",
      "masterbate",
      "masterbation",
      "masterbations",
      "masturbate",
      "mo-fo",
      "mof0",
      "mofo",
      "mothafuck",
      "mothafucka",
      "mothafuckas",
      "mothafuckaz",
      "mothafucked",
      "mothafucker",
      "mothafuckers",
      "mothafuckin",
      "mothafucking",
      "mothafuckings",
      "mothafucks",
      "mother fucker",
      "motherfuck",
      "motherfucked",
      "motherfucker",
      "motherfuckers",
      "motherfuckin",
      "motherfucking",
      "motherfuckings",
      "motherfuckka",
      "motherfucks",
      "muff",
      "mutha",
      "muthafecker",
      "muthafuckker",
      "muther",
      "mutherfucker",
      "n1gga",
      "n1gger",
      "nazi",
      "nigg3r",
      "nigg4h",
      "nigga",
      "niggah",
      "niggas",
      "niggaz",
      "nigger",
      "niggers",
      "nob jokey",
      "nobhead",
      "nobjocky",
      "nobjokey",
      "numbnuts",
      "nutsack",
      "orgasim",
      "orgasims",
      "orgasm",
      "orgasms",
      "p0rn",
      "pawn",
      "pecker",
      "penis",
      "penisfucker",
      "phonesex",
      "phuck",
      "phuk",
      "phuked",
      "phuking",
      "phukked",
      "phukking",
      "phuks",
      "phuq",
      "pigfucker",
      "pimpis",
      "piss",
      "pissed",
      "pisser",
      "pissers",
      "pisses",
      "pissflaps",
      "pissin",
      "pissing",
      "pissoff",
      "poop",
      "porn",
      "porno",
      "pornography",
      "pornos",
      "prick",
      "pricks",
      "pron",
      "pube",
      "pusse",
      "pussi",
      "pussies",
      "pussy",
      "pussys",
      "rectum",
      "retard",
      "rimjaw",
      "rimming",
      "s hit",
      "s.o.b.",
      "sadist",
      "schlong",
      "screwing",
      "scroat",
      "scrote",
      "scrotum",
      "semen",
      "sex",
      "sh!+",
      "sh!t",
      "sh1t",
      "shag",
      "shagger",
      "shaggin",
      "shagging",
      "shemale",
      "shi+",
      "shit",
      "shitdick",
      "shite",
      "shited",
      "shitey",
      "shitfuck",
      "shitfull",
      "shithead",
      "shiting",
      "shitings",
      "shits",
      "shitted",
      "shitter",
      "shitters",
      "shitting",
      "shittings",
      "shitty",
      "skank",
      "slut",
      "sluts",
      "smegma",
      "smut",
      "snatch",
      "son-of-a-bitch",
      "spac",
      "spunk",
      "s_h_i_t",
      "t1tt1e5",
      "t1tties",
      "teets",
      "teez",
      "testical",
      "testicle",
      "titfuck",
      "tits",
      "titt",
      "tittie5",
      "tittiefucker",
      "titties",
      "tittyfuck",
      "tittywank",
      "titwank",
      "tosser",
      "turd",
      "tw4t",
      "twat",
      "twathead",
      "twatty",
      "twunt",
      "twunter",
      "v14gra",
      "v1gra",
      "vagina",
      "viagra",
      "vulva",
      "w00se",
      "wang",
      "wank",
      "wanker",
      "wanky",
      "whoar",
      "whore",
      "willies",
      "xrated",
    ];

    //if guild is Mint, apply filter
    if (guildMember.guild.id == "628978428019736619") {
      //loop trough filter
      for (let i of filter) {
        //if matches, ban user
        if (
          guildMember.user.username
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '')
            .toLowerCase()
            .includes(i)
        )
          return guildMember.ban();
      }
    }

    //load guild channels
    const guildChannels = getGuild.get(guildMember.guild.id);

    //if no entry
    if (!guildChannels) return;

    //if guild does not exist
    if (!guildMember.client.guilds.cache.get(guildChannels.guild)) return;

    //define general channel
    const generalChannel1 = guildMember.client.channels.cache.get(
      guildChannels.generalChannel
    );

    //define mute channel
    const muteChannel1 = guildMember.client.channels.cache.get(
      guildChannels.muteChannel
    );

    //define logs channel
    const logsChannel1 = guildMember.client.channels.cache.get(
      guildChannels.logsChannel
    );

    if (guildMember.guild.id == "628978428019736619") {
      rolearray = [
        "674208095626592266",
        "674208167437139979",
        "674207678347608064",
        "674207950822440970",
      ];
      for (let i of rolearray) {
        let role = guildMember.guild.roles.cache.find((r) => r.id === `${i}`);
        guildMember.roles.add(role);
      }
    }

    //define members role
    let roleadd1 = guildMember.guild.roles.cache.find(
      (r) => r.name === "~/Members"
    );

    //redefine user
    let user = guildMember.user;

    //load userscore
    let userscore2 = getScore.get(user.id, guildMember.guild.id);

    //if no userscore
    if (!userscore2) {
      userscore2 = {
        id: `${guildMember.guild.id}-${user.id}`,
        user: user.id,
        guild: guildMember.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };

      //run database
      setScore.run(userscore2);
    }

    //get user account age
    var cdate = moment.utc(user.createdAt).format("YYYYMMDD");
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");

    //logs
    if (logsChannel1) {
      //load logger settings
      const loggerSettings = getSettings.get(guildMember.guild.id);

      //if on
      if (loggerSettings.leavejoin == "1") {
        //form embed
        const embed = new Discord.MessageEmbed()
          .setTitle(`User joined`)
          .setColor('#27ae60')
          .setAuthor(
            guildMember.user.username + "#" + guildMember.user.discriminator,
            guildMember.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setThumbnail(
            guildMember.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setDescription(`${guildMember.user}`)
          .addField(
            `This user has joined us.`,
            "\n" +
              guildMember.user.username +
              "\n" +
              guildMember.user.id +
              "\nAccount age: " +
              ageA.join(" ")
          )
          .setTimestamp();

        //send logs
        logsChannel1.send({
          embed,
        });
      }
    }

    //if there is a mute channel
    if (muteChannel1) {
      //unblock mute channel
      let channel2 = guildMember.guild.channels.cache.find(
        (channel) => channel.id === muteChannel1.id
      );
      await channel2.createOverwrite(user, {
        VIEW_CHANNEL: true,
        READ_MESSAGES: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: false,
      });

      //if Anti raid is on
      if (guildChannels.autoMod == "strict") {
        //notify user
        return muteChannel1.send(
          `${guildMember.user}` +
            "\nAutomod Strict is on!\nThis means that every user gets dumped into this channel.\nAutomod strict is usually enabled if there is a raid going on."
        );
      }

      //define prefix
      const prefixstart = getGuild.get(guildMember.guild.id);
      const prefix = prefixstart.prefix;

      //notify user to verify
      return muteChannel1.send(
        `${guildMember.user}` +
          "\nWelcome, you need to verify yourself first!\nTo begin write `" +
          prefix +
          "verify`"
      );
    }

    //make nice image for welcoming
    if (roleadd1) {
      guildMember.roles.add(roleadd1).catch(console.error);
    }

    //if general channel
    if (generalChannel1) {
      //build canvas
      const canvas = Canvas.createCanvas(700, 250);
      const ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage(
        "./modules/img/mintwelcome.png"
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = "30px Zelda";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 5;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        guildMember.user.username,
        canvas.width / 3.0,
        canvas.height / 2.0
      );
      ctx.font = "21px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "\nAccount age: " + ageA.join(" ") + "\nID: " + guildMember.id,
        canvas.width / 3.0,
        canvas.height / 2.0
      );
      const avatar = await Canvas.loadImage(
        guildMember.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      );
      ctx.drawImage(avatar, 600, 25, 50, 50);
      ctx.beginPath();
      ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      const guildlogo = await Canvas.loadImage(
        guildMember.guild.iconURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      );
      ctx.drawImage(guildlogo, 25, 25, 200, 200);
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
      );

      //load wmessage
      const wmessageStart = getGuild.get(guildMember.guild.id);
      const wmessage = wmessageStart.wmessage;

      //check if message
      if (!wmessage) {
        //send just a member call
        var sMessage = `${guildMember.user}`;
      } else {
        var sMessage = `${guildMember.user}, ${wmessage}`;
      }

      //send canvas
      await generalChannel1.send(sMessage.slice(0, 2000), attachment);
    }
  },
};
