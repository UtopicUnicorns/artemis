//load modules
npm = require("./NPM.js");
npm.npm();

//load database
dbinit = require("./dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  voiceStateUpdate: async function (oldMember, newMember) {
    /*     if (newMember.channelID && !oldMember.channelID) {
      let vc = await newMember.client.channels.cache.get(newMember.channelID);
      if (vc.members.size > 1) return;
      var connection = await vc.join();
      const dispatcher = await connection.play("./speen.mp3");

      dispatcher.on("finish", () => vc.leave());
    } */
  },
};
