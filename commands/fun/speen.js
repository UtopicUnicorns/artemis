//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `fun`,
  name: "speen",
  description: "[fun] Lose your money!",
  explain: `Each spin costs \u058F 20, just use the command \`!speen\` and hope for the best!
  
  Example usage: \`!speen\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("speen");
    usage.number++;
    setUsage.run(usage);

    //Cards
    const aniCard = message.client.emojis.cache.find(
      (emoji) => emoji.name === "aniSlot"
    );

    const aCard = message.client.emojis.cache.find(
      (emoji) => emoji.name === "AH"
    );

    const kCard = message.client.emojis.cache.find(
      (emoji) => emoji.name === "KH"
    );

    const qCard = message.client.emojis.cache.find(
      (emoji) => emoji.name === "QH"
    );

    const jCard = message.client.emojis.cache.find(
      (emoji) => emoji.name === "JH"
    );

    //Result
    const result1 = Math.floor(Math.random() * 4 + 1);
    switch (result1) {
      case 1:
        var c1 = jCard;
        break;
      case 2:
        var c1 = qCard;
        break;
      case 3:
        var c1 = kCard;
        break;
      case 4:
        var c1 = aCard;
        break;
    }

    const result2 = Math.floor(Math.random() * 4 + 1);
    switch (result2) {
      case 1:
        var c2 = jCard;
        break;
      case 2:
        var c2 = qCard;
        break;
      case 3:
        var c2 = kCard;
        break;
      case 4:
        var c2 = aCard;
        break;
    }

    const result3 = Math.floor(Math.random() * 4 + 1);
    switch (result3) {
      case 1:
        var c3 = jCard;
        break;
      case 2:
        var c3 = qCard;
        break;
      case 3:
        var c3 = kCard;
        break;
      case 4:
        var c3 = aCard;
        break;
    }

    //prizes
    if (result1 == 1 && result2 == 1 && result3 == 1) var prize = 150;

    if (result1 == 2 && result2 == 2 && result3 == 2) var prize = 250;

    if (result1 == 3 && result2 == 3 && result3 == 3) var prize = 500;

    if (result1 == 4 && result2 == 4 && result3 == 4) var prize = 1000;

    if (!prize) var prize = Math.floor((result1 + result2 + result3) * 1.5);

    //Userscore
    let userscore = getScore.get(message.author.id, message.guild.id);

    //substract 20
    let firstPoints = parseInt(-20, 10);
    userscore.points += firstPoints;

    //If userscore is too low
    if (userscore.points < 1)
      return message.reply(
        "You need at least `\u058F 21` to be able to play slots!"
      );

    //check user level
    let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));

    //old level to new level
    userscore.level = userLevel;

    //save into database
    setScore.run(userscore);

    //build message
    let aMessage = `
      \`=========\n| SLOTS |\n=========\`\n\`Each Spin\ncosts \u058F 20\`\n\`=========\`\n\|${aniCard}\|${aniCard}\|${aniCard}\|\n\`=========\`\nBalance:\n\`\u058F ${userscore.points.toLocaleString()}\``;

    //send message
    return message.channel.send(aMessage).then((msg) => {
      //Small delay
      setTimeout(() => {
        //add prize!
        let firstPoints = parseInt(prize, 10);
        userscore.points += firstPoints;

        //check user level
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));

        //old level to new level
        userscore.level = userLevel;

        //save into database
        setScore.run(userscore);

        //build message
        let bMessage = `
      \`=========\n|  WIN  |\n=========\`\n\|${c1}\|${c2}\|${c3}\|\n\`=========\`\nYou won:\n\`\u058F ${prize}\`\n\nNew balance:\n\`\u058F ${userscore.points.toLocaleString()}\``;

        //Edit message
        msg.edit(bMessage);
      }, 3000);
    });
  },
};
