//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "reload",
  description: "[mod] reload a command",
  explain: `This command allows you to reload a specified command to update new code and such.`,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `BAN_MEMBERS` permission."
      );

    //update usage
    usage = getUsage.get("reload");
    usage.number++;
    setUsage.run(usage);

    //define args
    const args = message.content.toLowerCase().slice(prefix.length + 7);

    //if no args
    if (!args) return message.reply("Specify a command to reload!");

    //other args
    const sargs = message.content
      .toLowerCase()
      .slice(prefix.length + 7)
      .split(" ");

    //if sargs is module
    if (sargs[0] == "module") {
      //if no sargs 1
      if (!sargs[1]) {
        let moduleName = [];
        Object.keys(require.cache).forEach(function (key) {
          let delReq = require.cache[key];
          if (delReq.id.includes("/root/Server/modules/"))
            return moduleName.push(delReq.id);
        });
        return message.reply(moduleName);
      } else {
        //if sargs 1
        let moduleName = [];
        Object.keys(require.cache).forEach(function (key) {
          let delReq = require.cache[key];
          if (delReq.id.includes(`/root/Server/modules/${sargs[1]}`)) {
            delete require.cache[key];
            return moduleName.push(delReq.id);
          }
        });

        //handle array
        if (moduleName.length < 1) {
          console.log(moduleName);
          return message.reply("No module found!");
        } else {
          return message.reply(`${moduleName} has been reloaded!`);
        }
      }
    }

    //define commandname
    const commandName = args;

    //if client does not have that command
    if (!message.client.commands.has(commandName)) {
      return message.reply("That command does not exist");
    }

    //Loop trough commands
    Object.keys(require.cache).forEach(function (key) {
      //rename obj
      let delReq = require.cache[key];

      //Target commands only
      if (delReq.id.includes("/root/Server/commands/")) {
        //Split objects
        let delReq2 = delReq.id.split("/");

        //Array
        let commandPush = [];

        //for every object
        delReq2.forEach((mod) => {
          //if object is input.js
          if (mod === `${commandName}.js`) {
            if (delReq.id.length > 1) {
              //Push into array
              commandPush.push(`${delReq.id}`);
            }
          }

          //loop trough array
          commandPush.forEach((comName) => {
            //if it includes this key
            if (comName.includes("/root/Server/commands/")) {
              //delete cache for command
              delete require.cache[require.resolve(`${comName}`)];

              //delete from set
              message.client.commands.delete(commandName);

              //reload command
              const props = require(`${comName}`);

              //pour into set
              message.client.commands.set(commandName, props);

              //notify
              message.reply(`The command ${commandName} has been reloaded`);
            }
          });
        });
      }
    });
  },
};
