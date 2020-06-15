//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "listen",
  description: "[fun] listen",
  explain: `listen`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("listen");
    usage.number++;
    setUsage.run(usage);

    //test
    const voiceChannel = message.member.voice.channel;
    var connection = await voiceChannel.join();
    const audio = connection.receiver.createStream(message.author, {
      mode: "pcm",
    });
    const recAudio = audio.pipe(fs.createWriteStream("user_audio.pcm"));
    recAudio.on("finish", () => {
      ffmpeg("user_audio.pcm")
        .inputFormat("s32le")
        .save("./user_audio.mp3")
        .on("progress", (p) => {
          //console.log(p);
        })
        .on("end", () => {
          //call transcript
          gspeech.recognize("./user_audio.mp3", async function (err, data) {
            if (data) {
              let tr = data.transcript;
              const voiceChannel = message.member.voice.channel;
              if (tr.includes("play")) {
                var connection = await voiceChannel.join();
                const dispatcher = connection.play("./test.mp3");
              } else {
                voiceChannel.leave();
                message.reply(tr);
              }
            } else {
              const voiceChannel = message.member.voice.channel;
              voiceChannel.leave();
              return message.reply("Error while recognizing speech!");
            }
          });
        });
    });
  },
};
