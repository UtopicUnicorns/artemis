const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
    name: 'stop',
    description: '[music] Stop all songs in the queue!',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('stop');
        usage.number++;
        setUsage.run(usage);
        //
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};