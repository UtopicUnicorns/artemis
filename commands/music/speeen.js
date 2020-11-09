//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//new set
musicPlay = new Set();

//start
module.exports = {
  category: `music`,
  name: "speeen",
  description: "[music] Vinesauce quote!",
  explain: `To use this command, you will have to be in a voice channel, there also has to be no music playing by the bot.
  
  Example usage: \`!speeen\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage update
    usage = getUsage.get("speeen");
    usage.number++;
    setUsage.run(usage);

    //form queue
    const queue = await message.client.queue;

    //form guild queue
    const serverQueue = await message.client.queue.get(message.guild.id);

    //if server queue
    if (serverQueue)
      return message.reply(
        "The bot is being used to play music, don't bother them."
      );

    //form voice channel
    const voiceChannel = await message.member.voice.channel;

    //if not in voice channel
    if (!voiceChannel)
      return message.reply("You have to be in a voice channel.");

    //check permissions
    const permissions = await voiceChannel.permissionsFor(message.client.user);

    //if no perms
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.reply(
        "I am lacking permissions to join the voice channel."
      );

    var connection = await voiceChannel.join();

    //Select speen
    //define pics
    const speens = fs.readdirSync("./media");

    //empty array
    const array = [];

    //loop trough photos
    for (const file of speens) {
      //push into array
      array.push(file);
    }

    let selSpeen = array[~~(Math.random() * array.length)];

    const dispatcher = await connection.play(`./media/${selSpeen}`);

    dispatcher.on("finish", () => voiceChannel.leave());
  },
};
