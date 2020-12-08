//start modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "case",
  description: "[mod] View and adjust cases",
  explain: `Cases are automatically generated when using certain commands.
A case is used to keep track of the baddies.

Example usage: \`!case view caseNum\`

Example usage: \`!case user userID\`

Example usage: \`!case reason caseNum [Reason here]\``,
  execute(message) {
    //load prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply("You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission.");

    //Usage
    usage = getUsage.get("case");
    usage.number++;
    setUsage.run(usage);

    //build args
    const args = message.content.slice(prefix.length + 5).split(" ");

    if (!args[0]) {
      const noArg = new Discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setThumbnail(
          message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setTitle("No Arguments provided.")
        .addField(
          "Usage: ",
          `Use these commands to control and view cases.
      Cases get automatically generated when using the mute, unmute, ban, kick and warn command.
      The cases are unique to your guild only.
      \`case view CaseNum\`
      \`case user mention/userID\`
      \`case reason CaseNum <Reason>\``
        );
      return message.channel.send({ embed: noArg });
    }

    //caseViewer
    function caseView(caseid, userid, username, type, reason, date) {
      //create embed
      const caseViewer = new Discord.MessageEmbed()
        .setTitle(`Case: ${caseid}`)
        .setAuthor(username)
        .setColor("RANDOM")
        .setDescription("Viewing case")
        .addField("Type: ", `${type}`)
        .addField("Date: ", `${date}`)
        .addField("Username: ", `${username}`)
        .addField("Reason: ", `${reason}`)
        .setFooter(`UserID: ${userid}`);

      //Send embed
      return message.channel.send({
        embed: caseViewer,
      });
    }

    //view
    switch (args[0].toLowerCase()) {
      case "view":
        //custom db
        let getACase2 = db
          .prepare("SELECT * FROM admincases WHERE guildidcaseid = ?")
          .all(`${message.guild.id}-${args[1]}`);

        //if no db
        if (!getACase2[0]) return message.reply("Case Number Not Found!");

        //if exists
        caseView(
          getACase2[0].caseid,
          getACase2[0].userid,
          getACase2[0].username,
          getACase2[0].type,
          getACase2[0].reason,
          getACase2[0].date
        );
        break;

      case "user":
        //form user
        if (!args[1]) {
          var user = message.author.id;
        } else {
          var user = args[1]
            .replace("<@", "")
            .replace(">", "")
            .replace("!", "");
        }

        //define db
        let userFind = db
          .prepare(
            `SELECT * FROM admincases WHERE guildid = ${message.guild.id} AND userid = ?`
          )
          .all(user);

        //array
        let str = [];

        //loop
        for (let i of userFind) {
          str.push(`\`${i.type} - case: ${i.caseid} - date: ${i.date}\``);
        }

        //if nothing
        if (str.length < 1)
          return message.reply("No cases found for this user");

        //send
        message.channel.send(str.join("\n"), {
          split: true,
        });
        break;

      case "reason":
        //custom db
        let GetCase = db.prepare(
          "SELECT * FROM admincases WHERE guildidcaseid = ?"
        );

        //getCase
        let GetCaseGet = GetCase.get(`${message.guild.id}-${args[1]}`);

        //if no entry
        if (!GetCaseGet) return message.reply("Invalid case number.");

        //if no reason
        if (!args[2])
          return message.reply(
            "You have not altered the reason, please try again."
          );

        let c1 = message.content.split(" ");

        //new args
        let sargs = message.content.slice(
          prefix.length + c1[0].length + c1[1].length + c1[2].length + 2
        );

        //run answer
        GetCaseGet.reason = sargs;
        setACase.run(GetCaseGet);

        //reply
        message.reply("Reason Altered!");
        break;
    }
  },
};
