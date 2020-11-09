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
  name: "play",
  description: "[music] Play a song!",
  explain: `Plays a specified song, or adds it to the queue if there is a song currently playing.

Example usage: \`!play YtURL\`

Example usage: \`!play Search Query\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //Usage update
    usage = getUsage.get("play");
    usage.number++;
    setUsage.run(usage);

    //return message.reply("Broken, plz fix.");

    try {
      //form args
      const args = message.content.slice(prefix.length + 5);

      //form queue
      const queue = message.client.queue;

      //form guild queue
      const serverQueue = message.client.queue.get(message.guild.id);

      //form voice channel
      const voiceChannel = message.member.voice.channel;

      //if no channel
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );

      //check permissions
      const permissions = voiceChannel.permissionsFor(message.client.user);

      //if no perms
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

      //get video info
      //See what to actually download
      const musicInfo = await youtube.searchVideos(args, 4);

      //form final URL
      const songInfo = await ytdl.getInfo(
        "https://www.youtube.com/watch?v=" + musicInfo[0].id
      );

      //form song
      const song = {
        title: musicInfo[0].title,
        //url: songInfo.video_url,
        url: musicInfo[0].id,
        thumb: musicInfo[0].thumbnails.high.url,
      };

      //if no queue
      if (!serverQueue) {
        //build queue
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };

        //set the queue
        queue.set(message.guild.id, queueContruct);

        //push song
        queueContruct.songs.push(song);

        try {
          //form connection
          var connection = await voiceChannel.join();

          //redefine conn
          queueContruct.connection = connection;

          //push play song
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        //push song into queue
        serverQueue.songs.push(song);

        //form embed
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
          .setImage(song.thumb)
          .setColor("RANDOM")
          .setDescription("Song was added to the queue")
          .addField(song.title, song.url);

        //send embed
        return message.channel.send(rembed);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    //form queue
    const queue = message.client.queue;

    //form guild
    const guild = message.guild;

    //form guild queue
    const serverQueue = queue.get(message.guild.id);

    //if no song
    if (!song) {
      //leave vc
      serverQueue.voiceChannel.leave();

      //clear queue
      queue.delete(guild.id);
      return;
    }

    //build dispatcher
    const dispatcher = serverQueue.connection
      .play(ytdl(`${song.url}`))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));

    //set volume
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    //form embed
    const srembed = new Discord.MessageEmbed()
      .setTitle(serverQueue.songs[0].title)
      .setImage(serverQueue.songs[0].thumb)
      .setColor("RANDOM")
      .setDescription("Started playing")
      .addField(serverQueue.songs[0].title, serverQueue.songs[0].url);

    //send embed
    message.channel.send(srembed);
  },
};
