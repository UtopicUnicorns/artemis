//Load modules
const npm = require("../../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  category: `mod`,
  name: "cc",
  description: "[mod] Custom Commands",
  explain: `\`!cc create\`
      *This will attempt to create a custom command.*

      You can use a few tags within the custom command:
      *these tags are what you use in the command, so not @whatever or a user ID*

      \`[author]\` This will insert the tag for whoever uses the command

      \`[mention]\` This will ping the first mentioned user when a command is used

      Example usage: \`!cc create slaps [mention] with a large fish! !!slap2:reply:start:yes!!\`

      Example usage: \`!cc [author] create slaps [mention] with a large fish! !!slap2:normal:start:yes!!\`

      Example usage: \`!cc create There is no such thing as bloat. !!bloat:reply:include:no!!\`

      \`!cc delete\`
      *This will allow you to remove a custom command.*

      Example usage: \`!cc delete slap\`
      This will delete the custom command slap if it exists.`,
  execute(message) {
    //define prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //if no proper perms
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply(
        "You do not have permissions to use this command!\nNeed `KICK_MEMBERS` permission."
      );

    //update usage
    usage = getUsage.get("cc");
    usage.number++;
    setUsage.run(usage);

    //args
    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 3)
      .split(" ");

    //switch
    switch (args[0]) {
      //creation of custom command
      case "create":
        //new args
        let args2 = message.content.slice(prefix.length + 10).split(" ");

        //error
        if (!args2[0])
          return message.reply(
            `Proper usage is:
            *Note that [author] and [mention] needs to be written this way, in the end command it will be converted to their proper usages.*

            \`${prefix}cc create [author] slaps [mention] with a large fish! !!slap:normal:start:yes!!\`
            Or
            \`${prefix}cc create slaps [mention] with a large fish! !!slap:reply:start:yes!!\``
          );

        //Command itself
        var commandStuff = [];

        //Command option chain
        var splitChainFinal = [];

        //loop trough args
        for (let i of args2) {
          //!!Commandname:reply/normal:startswith/include:prefixyes/prefixno!!
          if (i.startsWith("!!") && i.endsWith("!!")) {
            //split
            let splitChain = i.replace("!!", "").replace("!!", "").split(":");

            //defines commandname
            if (splitChain[0]) {
              splitChainFinal.push(splitChain[0].toLowerCase());
            } else {
              splitChainFinal.push("NA");
            }

            //defines if reply or normal message
            if (splitChain[1]) {
              splitChainFinal.push(splitChain[1].toLowerCase());
            } else {
              splitChainFinal.push("NA");
            }

            //defines if startswith or include
            if (splitChain[2]) {
              splitChainFinal.push(splitChain[2].toLowerCase());
            } else {
              splitChainFinal.push("NA");
            }

            //defines if prefix is needed
            if (splitChain[3]) {
              splitChainFinal.push(splitChain[3].toLowerCase());
            } else {
              splitChainFinal.push("NA");
            }
          } else {
            //push everything else into array

            commandStuff.push(`${i}`);
          }
        }

        //errors
        if (splitChainFinal[0] == "NA")
          return message.reply(
            "Proper command sequence is:\n`[author] slaps [mention] with a large fish. !!CommandNAME:Reply/Normal:startsWith/Include:PrefixYes/PrefixNo!!`\n\nYou did not give a command name!"
          );

        if (splitChainFinal[1] == "NA")
          return message.reply(
            "Proper command sequence is:\n`[author] slaps [mention] with a large fish. !!CommandNAME:Reply/Normal:startsWith/Include:PrefixYes/PrefixNo!!`\n\nYou did not define if this is a reply or a normal message!"
          );

        if (splitChainFinal[1] == "reply" || splitChainFinal[1] == "normal") {
        } else {
          return message.reply(
            "You did not properly specify if the command should be `reply` or `normal`"
          );
        }

        if (splitChainFinal[2] == "NA")
          return message.reply(
            "Proper command sequence is:\n`[author] slaps [mention] with a large fish. !!CommandNAME:Reply/Normal:startsWith/Include:PrefixYes/PrefixNo!!`\n\nYou did define if a message needs to startwith this command or can be anywhere in the message!"
          );

        if (splitChainFinal[2] == "start" || splitChainFinal[2] == "include") {
        } else {
          return message.reply(
            "You did not properly specify if the command should be `startswith` or `include`"
          );
        }

        if (splitChainFinal[3] == "NA")
          return message.reply(
            "Proper command sequence is:\n`[author] slaps [mention] with a large fish. !!CommandNAME:Reply/Normal:startsWith/Include:PrefixYes/PrefixNo!!`\n\nYou did not tell me if a prefix needs to be used or not!"
          );

        if (splitChainFinal[3] == "yes" || splitChainFinal[3] == "no") {
        } else {
          return message.reply(
            "You did not properly specify if the command needs a prefix with `yes` or `no`"
          );
        }

        commandCreate = {
          guildcc: `${message.guild.id}-${splitChainFinal[0]}`,
          guildid: `${message.guild.id}`,
          command: `${commandStuff.join(" ")}`,
          type: `${splitChainFinal[1]}`,
          gi: `${splitChainFinal[2]}`,
          prefixreq: `${splitChainFinal[3]}`,
        };

        //run database
        setCustomCommand.run(commandCreate);

        //reply
        return message.reply(
          `Command \`${splitChainFinal[0]}\` has been created!`
        );
        break;

      //Delete selected command
      case "delete":
        //error
        if (!args[1])
          return message.reply(
            `Proper useage is \`${prefix}cc delete commandName\``
          );

        //pull data from database
        let commandCheck2 = getCustomCommand.get(
          `${message.guild.id}-${args[1]}`
        );

        //error
        if (!commandCheck2)
          return message.reply("Custom command was not found!");

        //delete entry
        db.prepare(
          `DELETE FROM cc WHERE guildcc = '${message.guild.id}-${args[1]}'`
        ).run();

        //reply
        return message.reply(`Custom command \`${args[1]}\` has been deleted`);
        break;

      //help
      case "help":
        return message.reply(`
      Sit back and read.

      \`${prefix}cc create\`
      *This will attempt to create a custom command.*

      You can use a few tags within the custom command:
      *these tags are what you use in the command, so not @whatever or a user ID*

      \`[author]\` This will insert the tag for whoever uses the command

      \`[mention]\` This will ping the first mentioned user when a command is used

      Example usage: \`${prefix}cc create slaps [mention] with a large fish! !!slap2:reply:start:yes!!\`

      Example usage: \`${prefix}cc [author] create slaps [mention] with a large fish! !!slap2:normal:start:yes!!\`

      Example usage: \`${prefix}cc create There is no such thing as bloat. !!bloat:reply:include:no!!\`

      \`${prefix}cc delete\`
      *This will allow you to remove a custom command.*

      Example usage: \`${prefix}cc delete slap\`
      This will delete the custom command slap if it exists.

      `);
        break;
    }

    //array
    let entryView = [];

    //get entries
    let viewer = db
      .prepare("SELECT * FROM cc WHERE guildid = ?")
      .all(message.guild.id);

    //loop
    for (let i of viewer) {
      entryView.push(
        `\`${i.guildcc.replace(message.guild.id, "")} || ${i.type} || Prefix: ${
          i.prefixreq
        }\``
      );
    }

    //reply
    if (entryView.length > 0) {
      return message.channel.send(`${entryView.join("\n")}`, {
        split: true,
      });
    }

    return message.channel.send(`No custom commands yet.`);
  },
};
