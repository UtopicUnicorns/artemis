//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `hidden`,
  name: "lab",
  description: "[hidden] the lab",
  explain: `UtopicUnicorn's laboratory.`,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("lab");
    usage.number++;
    setUsage.run(usage);
    let Twitch = require("simple-twitch-api");

    const SCOPE = "user:read:email";

    Twitch.getToken(configfile.CLIENT_IDT, configfile.CLIENT_SECRETT, SCOPE).then(async (result) => {
      let access_token = result.access_token;

      let user = await Twitch.getUserInfo(access_token, configfile.CLIENT_IDT, "ellervated");
      let user_id = user.data[0].id;

      let stream_info = await Twitch.getStream(
        access_token,
        configfile.CLIENT_IDT,
        user_id
      );

      console.log(stream_info.data[0]);
    });
    return;
  },
};
