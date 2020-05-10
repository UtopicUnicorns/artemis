const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "react",
  description: "[server] Add CUSTOM EMOTE reactions to a message",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    if (!message.member.permissions.has("KICK_MEMBERS")) return;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("react");
    usage.number++;
    setUsage.run(usage);
    //
    if (message.content == prefix + "react")
      return message.reply(
        prefix + "react MessageID EmoteName EmoteName EmoteName..."
      );
    let args = message.content.slice(prefix.length + 6).split(" ");
    let array = [];
    for (let i of args) {
      if (i !== args[0]) {
        array.push(i);
      }
    }
    message.channel
      .messages.fetch(args[0])
      .then(messages => {
        for (let n in array) {
          if (n > 19) return;
          if (message.guild.emojis.cache.find(r => r.name == array[n])) {
            var emoji = [message.guild.emojis.cache.find(r => r.name == array[n])];
            for (let i in emoji) {
              messages.react(emoji[i]);
            }
          }
        }
      })
      .catch(error => {
        message.reply("Message ID does not exist");
      });

    /* ?eval let array = [":card_box:", ":tea:"];
message.channel.messages.fetch('693409597519691827')
            .then(messages => {
                for (let n in array) {
                    if (n > 19) return;
                    var emoji = [array[n]];
                    for (let i in emoji) {
                        messages.react(emoji[i]);
                    }
                
                }
            })
            .catch(error =>
                {
                    message.reply("Message ID does not exist");
                }
            ); */
  }
};
