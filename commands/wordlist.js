const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'wordlist',
    description: '[server] Add or remove bad words from the wordlist',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const getWords = db.prepare("SELECT * FROM words WHERE words = ?");
        const setWords = db.prepare("INSERT OR REPLACE INTO words (guild, words, wordguild) VALUES (@guild, @words, @wordguild);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('wordlist');
        usage.number++;
        setUsage.run(usage);
        //
        const args = message.content.toLowerCase().slice(prefix.length + 13).split(" ");
        const cargs = message.content.slice(prefix.length + 9).split(" ");
        const allwords = db.prepare("SELECT * FROM words WHERE guild = ?;").all(message.guild.id);
        let array = [];
        for (const data of allwords) {
            array.push(data.words);
        }
        if (cargs[0] == 'add') {
            if (args == '') return message.reply("It might be handy to add words!");
            for (let i of args) {
                if (!array.includes(i)) {
                    wordpush = {
                        guild: message.guild.id,
                        words: i,
                        wordguild: message.guild.id + i
                    }
                    setWords.run(wordpush);
                }
            }
            return message.reply("Done!");
        }
        if (cargs[0] == 'del') {
            if (args == '') return message.reply("It might be handy to add words!");
            for (let i of args) {
                if (array.includes(i)) {
                    let thishere = message.guild.id + i;
                    db.prepare(`DELETE FROM words WHERE wordguild = '${thishere}'`).run();
                }
            }
            return message.reply("Done!");
        }
        message.reply(prefix + 'wordlist add/del\n' + '||' + array.join(" ") + '||');
    }
};