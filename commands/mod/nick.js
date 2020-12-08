//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "nick",
  description: "[mod] Change a user nickname",
  explain: `Nick will allow you to change a user's nickname.

Example usage: \`!nick @mention [New Nick Name]\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //update usage
    usage = getUsage.get("nick");
    usage.number++;
    setUsage.run(usage);

    //define user
    const user = message.mentions.users.first();

    //if no user
    if (!user) return message.reply("You must mention someone!");

    //define args
    const args = message.content.slice(prefix.length + user.id.length + 10);

    //if no args
    if (!args) return message.reply("You must give a new nickname!");

    //change nickname
    message.guild.members.cache
      .get(user.id)
      .setNickname(args)
      .catch(console.log(""));

    //AdminCases
    const member22 = message.mentions.members.first();

    //check if database is filled
    let c = getACase.get(message.guild.id);
    if (!c) {
      var caseNum = 1;
    } else {
      let adminCaseCount = db
        .prepare(
          "SELECT * FROM admincases WHERE guildid = ? ORDER BY caseid DESC;"
        )
        .all(message.guild.id);

      let adminCaseCountCur = adminCaseCount[0].caseid;
      adminCaseCountCur++;
      var caseNum = adminCaseCountCur;
    }

    //Build the case
    adminCase = {
      guildidcaseid: `${message.guild.id}-${caseNum}`,
      caseid: caseNum,
      guildid: message.guild.id,
      userid: member22.id,
      username: `${member22.user.username}#${member22.user.discriminator}`,
      type: `nickname`,
      reason: message.content,
      date: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
    };

    //submit the case
    setACase.run(adminCase);

    //notify user
    return message.reply(
      `${user} nickname changed to: ${args}\nCase: ${caseNum}`
    );
  },
};
