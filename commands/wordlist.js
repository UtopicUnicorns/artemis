//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "wordlist",
  description: "[server] Add or remove bad words from the wordlist",
  explain: `This command manages the banned wordlist which will be active when automod is ON.\n
  \`wordlist add Word1 Word2 Word3\` will add words to the banned list.\n
  \`wordlist del Word1 Word2 Word3\` will delete the words from the banned list.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS")) return;

    //update usage
    usage = getUsage.get("wordlist");
    usage.number++;
    setUsage.run(usage);

    //form args
    const args = message.content
      .toLowerCase()
      .slice(prefix.length + 13)
      .split(" ");

    //form args 2
    const cargs = message.content.slice(prefix.length + 9).split(" ");

    //pull words from db
    const allwords = db
      .prepare("SELECT * FROM words WHERE guild = ?;")
      .all(message.guild.id);

    //empty array
    let array = [];

    //loop trough words
    for (const data of allwords) {
      //push words
      array.push(data.words);
    }

    //add
    if (cargs[0] == "add") {
      //if no args
      if (args == "") return message.reply("It might be handy to add words!");

      //loop trough args
      for (let i of args) {
        //if data does not exist yet
        if (!array.includes(i)) {
          //add to database
          wordpush = {
            guild: message.guild.id,
            words: i,
            wordguild: message.guild.id + i,
          };

          //run database
          setWords.run(wordpush);
        }
      }

      //notify
      return message.reply("Done!");
    }

    //del
    if (cargs[0] == "del") {
      //if no args
      if (args == "") return message.reply("It might be handy to add words!");

      //loop trough args
      for (let i of args) {
        //if args exist
        if (array.includes(i)) {
          //delete from database
          let thishere = message.guild.id + i;
          db.prepare(`DELETE FROM words WHERE wordguild = '${thishere}'`).run();
        }
      }

      //notify
      return message.reply("Done!");
    }

    //nothing
    return message.reply(
      prefix + "wordlist add/del\n" + "||" + array.join(" ") + "||"
    );
  },
};
