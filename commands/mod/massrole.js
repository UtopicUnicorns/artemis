//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "massrole",
  description: "[mod] Give mentioned role to everyone",
  explain: `By giving this command a rolename you can add the role to every member in your server who does not have this role yet.
  
  Example usage: \`massrole roleName\``,
  async execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `BAN_MEMBERS` permission."
      );

    //update usage
    usage = getUsage.get("massrole");
    usage.number++;
    setUsage.run(usage);

    //args
    let args = message.content.slice(prefix.length + 9);

    //cache members
    await message.guild.members.fetch();

    //throw all members into an array
    let array = await message.guild.members.cache.map((m) => m);

    //define role
    const role = await message.guild.roles.cache.find((r) => r.name === args);

    //if no role
    if (!role) return message.reply("Role not found!");

    message.reply("This may take a while, i'll let you know when I am done!");

    for (let i of array)
      if (!i.roles.cache.find((r) => r.id === role.id))
        if (!i.user.bot)
          await message.guild.members.cache.get(i.user.id).roles.add(role);

    message.reply(
      `Done, added role ${role.name} to all users who did not have this role!`
    );
  },
};
