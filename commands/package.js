//Load modules
const npm = require("../modules/NPM.js");
npm.npm();

//load database
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();

//start
module.exports = {
  name: "package",
  description: "[linux] Searches Ubuntu/Mint packages",
  explain: `Limited package search for both Arch repositories and Ubuntu.\n
  \`package arch Query\`\n
  \`package ubuntu Query\``,
  execute(message) {
    //build prefix
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;

    //update usage
    usage = getUsage.get("package");
    usage.number++;
    setUsage.run(usage);

    //define args
    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 8)
      .split(" ");

    //if no args
    if (!args[0])
      return message.reply(
        prefix + "package arch PKGname\n" + prefix + "package ubuntu PKGname\n"
      );

    //if ubuntu
    if (args[0] == "ubuntu") {
      //new args
      let args2 = message.content.toLowerCase().slice(prefix.length + 15);

      //defien stuff
      let baseurl =
        "https://api.launchpad.net/1.0/ubuntu/+archive/primary?ws.op=getPublishedSources&source_name=";
      let url = baseurl + args2 + "&exact_match=true";

      //start request
      request(
        url,
        {
          json: true,
        },
        (err, res, body) => {
          //if no body
          if (!body.entries[0]) {
            //build embed
            const embed = new Discord.MessageEmbed()
              .setTitle(`Package`)
              .setColor("RANDOM")
              .setDescription("Not found!");

            //send embed
            return message.channel.send({
              embed: embed,
            });
          }

          //definitions
          let creator = body.entries[0].package_creator_link;
          let pkgname = body.entries[0].source_package_name;
          let version = body.entries[0].source_package_version;

          //if error
          if (err) return message.channel.send(err);

          //build embed
          const embed = new Discord.MessageEmbed()
            .setTitle(`${pkgname}`)
            .setColor("RANDOM")
            .setDescription(`sudo apt install ${pkgname}`)
            .addField("Version: ", `${version}`)
            .addField("Launchpad: ", `${creator}`);

          //send embed
          return message.channel.send({
            embed: embed,
          });
        }
      );
    }

    //if arch
    if (args[0] == "arch") {
      //new args
      let args2 = message.content.toLowerCase().slice(prefix.length + 13);

      //define stuff
      let baseurl = "https://www.archlinux.org/packages/search/json/?q=";
      let url = baseurl + args2;

      //start request
      request(
        url,
        {
          json: true,
        },
        (err, res, body) => {
          //if no body
          if (!body.results[0]) {
            //build embed
            const embed = new Discord.MessageEmbed()
              .setTitle(`Package`)
              .setColor("RANDOM")
              .setDescription("Not found!");

            //send embed
            return message.channel.send({
              embed: embed,
            });
          }

          //definotions
          let descr = body.results[0].pkgdesc;
          let creator = body.results[0].url;
          let pkgname = body.results[0].pkgname;
          let version = body.results[0].pkgver;

          //if error
          if (err) return message.channel.send(err);

          //build embed
          const embed = new Discord.MessageEmbed()
            .setTitle(`${pkgname}`)
            .setColor("RANDOM")
            .setDescription(`sudo pacman -S ${pkgname}`)
            .addField("Version: ", `${version}`)
            .addField("Creator URL: ", `${creator}`)
            .addField("Description: ", `${descr}`);

          //send embed
          return message.channel.send({
            embed: embed,
          });
        }
      );
    }
  },
};
