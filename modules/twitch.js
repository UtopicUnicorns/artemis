//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  twitchEmit: async function (dat, client) {
    //pull guild
    const guildChannels = await getGuild.get(dat[1]);

    //if no guild
    if (!guildChannels) return;

    //Grab the guild
    const guildGrab = await client.guilds.cache.get(guildChannels.guild);

    //if no guild
    if (!guildGrab) return;

    //additional checks
    if (!guildChannels.streamChannel) return;
    if (guildChannels.streamChannel == "0") return;

    //if offline
    if (dat[2] == "OFFLINE") {
      //get the streamer
      let StreamerCheck = await getStreamers.get(`${dat[1]}-${dat[0]}`);

      //if not in database somehow
      if (!StreamerCheck) return;

      if (StreamerCheck.status == "offline") {
        return;
      } else {
        //set to offline
        StreamerCheck.status = "offline";

        //run database
        setStreamers.run(StreamerCheck);

        return await client.channels.cache
          .get(guildChannels.streamChannel)
          .send(`${dat[0]} went offline!`);
      }
    } else {
      //get the streamer too
      let StreamerCheck = await getStreamers.get(`${dat[1]}-${dat[0]}`);

      //check status
      if (StreamerCheck.status == "offline") {
        //set to offline
        StreamerCheck.status = "online";

        //run database
        setStreamers.run(StreamerCheck);

        const SCOPE = "analytics:read:games";

        //call twitch module, insert client ID and secret and scopes needed
        Twitch.getToken(
          configfile.CLIENT_IDT,
          configfile.CLIENT_SECRETT,
          SCOPE
        ).then(
          //display results
          async (result) => {
            //get info
            let stream_info = await Twitch.getGames(
              result.access_token,
              configfile.CLIENT_IDT,
              dat[3]
            );

            //Define stuffs
            let gameName = stream_info.data[0].name;
            let gameImg = await stream_info.data[0].box_art_url
              .replace("{width}", "500")
              .replace("{height}", "500")
              .replace("./", "");
            //console.log(gameImg);
            let streamImg = dat[6]
              .replace("{width}", "500")
              .replace("{height}", "400");
            let streamUrl = `https://twitch.tv/${dat[0]}`;
            let streamView = dat[5];
            let streamName = dat[0];
            let streamInfo = dat[4];

            //build embed
            const embed = new Discord.MessageEmbed()
              .setAuthor(streamName, gameImg)
              .setThumbnail(gameImg)
              .setTitle(`${streamName} is streaming ${gameName}!`)
              .setColor(`RANDOM`)
              .setURL(streamUrl)
              .setDescription(`${streamName} went live on Twitch!`)
              .addField(streamInfo, "\n" + streamUrl)
              .setImage(gameImg)
              .setFooter(`Viewers: ${streamView}`);

            //check if @here is enabled
            if (guildChannels.streamHere == "2") {
              return await client.channels.cache
                .get(guildChannels.streamChannel)
                .send("@here", {
                  embed,
                });
            } else {
              return await client.channels.cache
                .get(guildChannels.streamChannel)
                .send({
                  embed,
                });
            }
          }
        );
      } else {
        return;
      }
    }
  },
};
