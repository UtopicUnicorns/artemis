const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "play",
  description: "[music] Play a song!",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("play");
    usage.number++;
    setUsage.run(usage);
    //

    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 5)
      .split("+");
    if (!args[0]) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Usage")
        .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
        .setColor("RANDOM")
        .addField(
          prefix + "play song query",
          prefix + "play song query + song query + song query"
        )
        .addField(
          prefix + "play youtubeURL",
          prefix + "play youtube URL + youtube URL + youtube URL"
        )
        .addField("It is possible to see the queue:", prefix + "np")
        .addField("I also have some preconfigured playlists:", prefix + "list")
        .addField(prefix + "skip", prefix + "skip 4")
        .addField(prefix + "pause", prefix + "resume");
      return message.channel.send(embed);
    }
    const voiceChannel1 = message.member.voiceChannel;
    if (!voiceChannel1) return message.reply("Join a voicechannel first!");
    const permissions1 = voiceChannel1.permissionsFor(message.client.user);
    if (!permissions1.has("CONNECT") || !permissions1.has("SPEAK"))
      return message.reply(
        "It looks like I have no permission to talk in the channel you are in."
      );
    let playlistlist = [];
    for (let i of args) {
      playlistlist.push(i);
    }
    //start
    //sleep
    let count = "-1";
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    //
    for (let i of playlistlist) {
      count++;
      await sleep(count * 30000);
      //
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);
      const voiceChannel = message.member.voiceChannel;
      if (!voiceChannel) return;
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return;
      let openmusicurl2 = await youtube.searchVideos(i, 4);
      if (!openmusicurl2)
        return message.reply("Sorry, something went wrong. try again.");
      let openmusicurl = openmusicurl2[0].url;
      const id = openmusicurl2[0].id;
      const file = "./music/" + openmusicurl2[0].title + ".mp3";
      message.delete();

      let stream = ytdl(id, {
        quality: "highestaudio",
      });
      let embed = new Discord.MessageEmbed()
        .setTitle(openmusicurl2[0].title)
        .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
        .setThumbnail(openmusicurl2[0].thumbnails.default.url)
        .setColor("RANDOM")
        .setDescription("Downloading......")
        .addField(
          openmusicurl2[0].title,
          "https://www.youtube.com/watch?v=" + openmusicurl2[0].id
        );
      let messageToEdit = message.channel.send(embed);

      ffmpeg(stream)
        .audioBitrate(128)
        .save(file)
        .on("progress", (p) => {
          let embed2 = new Discord.MessageEmbed()
            .setTitle(openmusicurl2[0].title)
            .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
            .setThumbnail(openmusicurl2[0].thumbnails.default.url)
            .setColor("RANDOM")
            .setDescription(
              "Downloading......" + p.targetSize + "kb downloaded"
            )
            .addField(
              openmusicurl2[0].title,
              "https://www.youtube.com/watch?v=" + openmusicurl2[0].id
            );
          messageToEdit.then((messageToEdit) => {
            messageToEdit.edit(embed2);
          });
        })
        .on("end", async () => {
          messageToEdit.then((messageToEdit) => {
            messageToEdit.delete();
          });
          var song = {
            title: openmusicurl2[0].title,
            thumb: openmusicurl2[0].thumbnails.default.url,
            webs: "https://www.youtube.com/watch?v=" + openmusicurl2[0].id,
            url: file,
          };
          if (!song) {
            return message.reply("No song found!");
          }
          if (!serverQueue) {
            const queueContruct = {
              textChannel: message.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 10,
              playing: true,
            };
            queue.set(message.guild.id, queueContruct);
            queueContruct.songs.push(song);
            try {
              var connection = await voiceChannel.join();
              queueContruct.connection = connection;
              this.play(message, queueContruct.songs[0]);
              message.delete();
              const rembed = new Discord.MessageEmbed()
                .setTitle(song.title)
                .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
                .setThumbnail(song.thumb)
                .setColor("RANDOM")
                .setDescription("Started playing: ")
                .addField(song.title, song.webs);
              return message.channel.send(rembed);
            } catch (err) {
              console.log(err);
              queue.delete(message.guild.id);
              message.delete();
              return message.channel.send("error");
            }
          } else {
            messageToEdit.then((messageToEdit) => {
              messageToEdit.delete();
            });
            serverQueue.songs.push(song);
            const rembed = new Discord.MessageEmbed()
              .setTitle(song.title)
              .setAuthor(message.author.username, message.author.avatarURL({ format: "jpg" }))
              .setThumbnail(song.thumb)
              .setColor("RANDOM")
              .setDescription("Song was added to the queue")
              .addField(song.title, song.webs);
            return message.channel.send(rembed);
          }
        });

      //
    }
    //
  },
  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    const dispatcher = serverQueue.connection
      .play(song.url)
      .on("end", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", (error) => {
        console.error(error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 50);
  },
};
