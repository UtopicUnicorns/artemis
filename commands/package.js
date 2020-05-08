const npm = require('../modules/NPM.js');
npm.npm();
module.exports = {
  name: "package",
  description: "[linux] Searches Ubuntu/Mint packages",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("package");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 8)
      .split(" ");
    if (!args[0])
      return message.reply(
        prefix + "package arch PKGname\n" + prefix + "package ubuntu PKGname\n"
      );
    if (args[0] == "ubuntu") {
      let args2 = message.content.toLowerCase().slice(prefix.length + 15);
      let baseurl =
        "https://api.launchpad.net/1.0/ubuntu/+archive/primary?ws.op=getPublishedSources&source_name=";
      let url = baseurl + args2 + "&exact_match=true";
      request(
        url,
        {
          json: true
        },
        (err, res, body) => {
          if (!body.entries[0]) {
            const embed = new Discord.MessageEmbed()
              .setTitle(`Package`)
              .setColor("RANDOM")
              .setDescription("Not found!");
            return message.channel.send({
              embed: embed
            });
          }
          let creator = body.entries[0].package_creator_link;
          let pkgname = body.entries[0].source_package_name;
          let version = body.entries[0].source_package_version;
          if (err) return message.channel.send(err);
          const embed = new Discord.MessageEmbed()
            .setTitle(`${pkgname}`)
            .setColor("RANDOM")
            .setDescription(`sudo apt install ${pkgname}`)
            .addField("Version: ", `${version}`)
            .addField("Launchpad: ", `${creator}`);
          return message.channel.send({
            embed: embed
          });
        }
      );
    }
    if (args[0] == "arch") {
      let args2 = message.content.toLowerCase().slice(prefix.length + 13);
      let baseurl = "https://www.archlinux.org/packages/search/json/?q=";
      let url = baseurl + args2;
      request(
        url,
        {
          json: true
        },
        (err, res, body) => {
          if (!body.results[0]) {
            const embed = new Discord.MessageEmbed()
              .setTitle(`Package`)
              .setColor("RANDOM")
              .setDescription("Not found!");
            return message.channel.send({
              embed: embed
            });
          }
          let descr = body.results[0].pkgdesc;
          let creator = body.results[0].url;
          let pkgname = body.results[0].pkgname;
          let version = body.results[0].pkgver;
          if (err) return message.channel.send(err);
          const embed = new Discord.MessageEmbed()
            .setTitle(`${pkgname}`)
            .setColor("RANDOM")
            .setDescription(`sudo pacman -S ${pkgname}`)
            .addField("Version: ", `${version}`)
            .addField("Creator URL: ", `${creator}`)
            .addField("Description: ", `${descr}`);
          return message.channel.send({
            embed: embed
          });
        }
      );
    }
  }
};
