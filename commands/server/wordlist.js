//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `server`,
  name: "wordlist",
  description: "[server] Add or remove bad words from the wordlist",
  explain: `This is a core command for [Automod](#Automod).

Without arguments the wordlist will be shown. To somewhat protect people from seeing bad words, the wordlist will be shown within spoiler tags.
When you add words to the list, and when Automod is ON, users without the kick permission will get their full message removed without notice when they use a word on the list.
This system is not perfect and is not meant to be used as your main moderator.

Example usage: \`!wordlist add Word1 Word2 Word3\`

Example usage: \`!wordlist del Word1 Word2 Word3\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no perms
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply("You do not have permissions to use this command!");

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
            wordguild: `${await message.guild.id}${i}`,
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
          db.prepare(
            `DELETE FROM words WHERE words = '${i}' AND guild = '${message.guild.id}'`
          ).run();
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
