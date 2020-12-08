//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `server`,
  name: "check",
  description: "[server] Role check",
  explain: `This command allows you to see which users in your guild/server have or don't have a certain role you specify.

Example usage: \`!check yes roleName\`

Example usage: \`!check not roleName\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `MUTE_MEMBERS` permission."
      );

    //update usage
    usage = getUsage.get("check");
    usage.number++;
    setUsage.run(usage);

    //form first args
    const args = message.content.slice(prefix.length + 6).split(" ");

    //form second args
    const cargs = message.content.slice(prefix.length + 10);

    //if no args
    if (!args[0] || !args[1])
      return message.reply(`
      Format:
      \`${prefix}check yes RoleName/RoleID\`
      \`${prefix}check not RoleName/RoleID\`
      `);

    //throw all members into an array
    let array = await message.guild.members.cache.map((m) => m);

    //roles
    const role =
      (await message.guild.roles.cache.find((r) => r.id === cargs)) ||
      (await message.guild.roles.cache.find((r) => r.name === cargs));

    //if not a role
    if (!role) return message.reply("This role was not found.");

    //final array
    let str = [];

    //switch
    switch (args[0]) {
      //if case is not
      case "not":
        //loop array
        for (let i of array)
          if (!i.roles.cache.find((r) => r.id === role.id))
            if (!i.user.bot)
              str.push(
                `${i} / ${i.id}\n${i.user.username}\nDoes not have ${role}`
              );

        break;

      //if case is yes
      case "yes":
        //loop array
        for (let i of array)
          if (i.roles.cache.find((r) => r.id === role.id))
            if (!i.user.bot)
              str.push(`${i} / ${i.id}\n${i.user.username}\nDoes have ${role}`);

        break;
    }

    //continue
    /**
     * Creates an embed with guilds starting from an index.
     * @param {number} start The index to start from.
     */
    const generateEmbed = (start) => {
      const current = str.slice(start, start + 10);

      //Embed template
      const embed = new Discord.MessageEmbed()
        .setTitle(`${start + 1}-${start + current.length} / ${str.length}`)
        .setColor("RANDOM")
        .setThumbnail(
          message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setAuthor(
          message.guild.name,
          message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        );

      current.forEach((g) => embed.addField("\u200B", g));
      return embed;
    };

    //Define user
    const author = message.author;

    //First emb
    message.channel.send(generateEmbed(0)).then((message) => {
      //If length is below 10
      if (str.length <= 10) return;

      //At start only right arrow is needed
      message.react("➡️");

      //form collector
      const collector = message.createReactionCollector(
        //Collect left and right from user
        (reaction, user) =>
          ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === author.id,

        //time out
        { time: 600000 }
      );

      //current page is 0
      let currentIndex = 0;

      //on collect event
      collector.on("collect", (reaction) => {
        //remove the existing reactions
        message.reactions.removeAll().then(async () => {
          // increase/decrease index
          reaction.emoji.name === "⬅️"
            ? (currentIndex -= 10)
            : (currentIndex += 10);

          //gen new embed
          message.edit(generateEmbed(currentIndex));

          //apropriate emojis
          if (currentIndex !== 0) await message.react("⬅️");
          if (currentIndex + 10 < str.length) message.react("➡️");
        });
      });
    });
  },
};
