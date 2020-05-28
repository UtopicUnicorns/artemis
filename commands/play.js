//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//new set
musicPlay = new Set();

//start
module.exports = {
  name: "play",
  description: "[music] Play a song!",
  async execute(message) {
    //start prefix
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage update
    usage = getUsage.get("play");
    usage.number++;
    setUsage.run(usage);

    //failsafe?
    if (await musicPlay.has(message.guild.id + "yes")) {
      return message.reply(
        "Please wait for the previous song to complete their download!"
      );
    }

    //Form args
    let args = message.content.toLowerCase().slice(prefix.length + 5);

    //If no args, give context
    if (!args) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Usage")
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setColor("RANDOM")
        .addField(
          "Usage:\n",
          prefix + "play song query" + "\n" + prefix + "play youtubeURL"
        )
        .addField("It is possible to see the queue:", prefix + "np")
        .addField(prefix + "skip", prefix + "skip 4")
        .addField(prefix + "pause", prefix + "resume");
      return message.channel.send(embed);
    }

    //voicechannel check
    const voiceChannel1 = message.member.voice.channel;
    if (!voiceChannel1) return message.reply("Join a voicechannel first!");
    const permissions1 = voiceChannel1.permissionsFor(message.client.user);
    if (!permissions1.has("CONNECT") || !permissions1.has("SPEAK"))
      return message.reply(
        "It looks like I have no permission to talk in the channel you are in."
      );

    //Shorten some stuff
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;

    //No voice channel
    if (!voiceChannel) return;

    //check permissions
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return;

    //See what to actually download
    let openmusicurl2 = await youtube.searchVideos(args, 4);
    if (!openmusicurl2)
      return message.reply("Sorry, something went wrong. try again.");

    //if no url
    if (!openmusicurl2[0]) return message.reply("Song not found");

    //construct filenames and such
    let openmusicurl = openmusicurl2[0].url;

    const id = openmusicurl2[0].id;
    const file = "./music/" + openmusicurl2[0].title + ".mp3";

    //Delete user message
    message.delete();

    //return console.log(file);

    //check if download exists
    if (fs.existsSync(file)) {
      var song = {
        title: openmusicurl2[0].title,
        thumb: openmusicurl2[0].thumbnails.default.url,
        webs: "https://www.youtube.com/watch?v=" + openmusicurl2[0].id,
        url: file,
      };

      //If no song
      if (!song) {
        return message.reply("No song found!");
      }

      //construct server queue if there is none
      //else skip to else
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
          //join members voice channel
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;

          //start playing song
          this.play(message, queueContruct.songs[0]);

          //send a new embed
          const rembed = new Discord.MessageEmbed()
            .setTitle(song.title)
            .setAuthor(
              message.author.username,
              message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setThumbnail(song.thumb)
            .setColor("RANDOM")
            .setDescription("Started playing: ")
            .addField(song.title, song.webs);
          return message.channel.send(rembed);
        } catch (err) {
          return message.channel.send("error");
        }
      } else {
        //push song into queue
        serverQueue.songs.push(song);

        //send embed to notify
        const rembed = new Discord.MessageEmbed()
          .setTitle(song.title)
          .setAuthor(
            message.author.username,
            message.author.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            })
          )
          .setThumbnail(song.thumb)
          .setColor("RANDOM")
          .setDescription("Song was added to the queue")
          .addField(song.title, song.webs);
        return message.channel.send(rembed);
      }
    }

    //basically a small shortcut
    let stream = await ytdl(id, {
      quality: "highestaudio",
    });
    if (!stream) return message.reply("An error has occured, try again!");

    //Add to failsafe
    musicPlay.add(message.guild.id + "yes");

    //send a reply
    let messageA = message.reply(
      "Downloading:\n\uD83C\uDFB5" + openmusicurl2[0].title
    );

    //Start downloading and converting
    ffmpeg(stream)
      .audioBitrate(320)
      .save(file)
      .on("progress", (p) => {
        //edit previous reply
        messageA.then((messageA) => {
          messageA.edit(
            "Downloading:\n\uD83C\uDFB5" +
              openmusicurl2[0].title +
              "\nProgress: kb/" +
              p.targetSize
          );
        });
      })
      .on("end", async () => {
        //delete failsafe
        musicPlay.delete(message.guild.id + "yes");

        //add downloaded song to queue
        var song = {
          title: openmusicurl2[0].title,
          thumb: openmusicurl2[0].thumbnails.default.url,
          webs: "https://www.youtube.com/watch?v=" + openmusicurl2[0].id,
          url: file,
        };

        //If no song
        if (!song) {
          return message.reply("No song found!");
        }

        //construct server queue if there is none
        //else skip to else
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 30,
            playing: true,
          };
          queue.set(message.guild.id, queueContruct);
          queueContruct.songs.push(song);
          try {
            //join members voice channel
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;

            //start playing song
            this.play(message, queueContruct.songs[0]);

            //send a new embed
            const rembed = new Discord.MessageEmbed()
              .setTitle(song.title)
              .setAuthor(
                message.author.username,
                message.author.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                })
              )
              .setThumbnail(song.thumb)
              .setColor("RANDOM")
              .setDescription("Started playing: ")
              .addField(song.title, song.webs);
            return message.channel.send(rembed);
          } catch (err) {
            return message.channel.send("error");
          }
        } else {
          //push song into queue
          serverQueue.songs.push(song);

          //send embed to notify
          const rembed = new Discord.MessageEmbed()
            .setTitle(song.title)
            .setAuthor(
              message.author.username,
              message.author.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              })
            )
            .setThumbnail(song.thumb)
            .setColor("RANDOM")
            .setDescription("Song was added to the queue")
            .addField(song.title, song.webs);
          return message.channel.send(rembed);
        }
      });
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
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
        if (serverQueue.songs[0]) {
          message.channel.send(
            "\uD83C\uDFB5Now playing: " + serverQueue.songs[0].title
          );
        }
      })
      .on("error", (error) => {
        console.error(error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 50);
  },
};
