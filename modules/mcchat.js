const util       = require("util");
const color      = require("ansi-color").set;
const readline   = require('readline');
const mc         = require('minecraft-protocol');
const DiscordAPI = require("discord.js");
const fs         = require('fs');
const rcon       = require('./modules/rcon.js').newHandle;
const RedDucks   = new DiscordAPI.Client();
const states     = mc.states;
const rconClient = new rcon();
rconClient.connect("artemisbot.eu", 25575, configfile.MCPASS);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var formatList = {
    "black": 'black+white_bg',
    "dark_blue": 'blue',
    "dark_green": 'green',
    "dark_aqua": 'cyan',
    "dark_red": 'red',
    "dark_purple": 'magenta',
    "gold": 'yellow',
    "gray": 'black+white_bg',
    "dark_gray": 'black+white_bg',
    "blue": 'blue',
    "green": 'green',
    "aqua": 'cyan',
    "red": 'red',
    "light_purple": 'magenta',
    "yellow": 'yellow',
    "white": 'white',
    "obfuscated": 'blink',
    "bold": 'bold',
    "strikethrough": '',
    "underlined": 'underlined',
    "italic": '',
    "reset": 'white+black_bg'
};

var dictionary = {
    "chat.stream.emote": "(%s) * %s %s",
    "chat.stream.text": "(%s) <%s> %s",
    "chat.type.achievement": "%s has just earned the achievement %s",
    "chat.type.admin": "[%s: %s]",
    "chat.type.announcement": "[%s] %s",
    "chat.type.emote": "* %s %s",
    "chat.type.text": "<%s> %s"
};


var client = mc.createClient({
    username: configfile.MCANAME,
    password: configfile.MCAPASS,
    host: "artemisbot.eu",
    port: 25565,
    version: "1.16.1"
});
client.on('success', function(player, status) {
    console.log("Minecraft client logged in.");
});
client.on('login', function(player, status) {
    console.log("Minecraft client joined server");
});
client.on('chat', function(packet) {
    var json = JSON.parse(packet.message);
    console.log(json.translate);
    if(json.translate == 'chat.type.announcement' || json.translate == 'chat.type.text') {
        var message = parseChat(json, {});
        var channelID = RedDucks.channels.array()[0]["id"];
        RedDucks.channels.get(channelID).sendMessage("**Server**\n"+message);
        console.log(message);
    }
});

rl.on('line', function(input) {
    client.write("chat", { message: input, position: 0 });
});


RedDucks.on('ready', () => {
    var channelID = RedDucks.channels.array()[0]["id"];
    console.log("Discord bot ready");
});
RedDucks.on("message", (text) => {
    if (!text.member.nickname) {
        var discordUser = text.author.username;
    } else {
         var discordUser = text.member.nickname;
    }
    console.log(text.member.nickname);
    if (text.author.bot) {return;} // We don't want it to run if it's the/a bots messages
    //client.write("chat", { message: text.content, position: 0 }); //Old function that sends messages via client.
    rconClient.sendCommand('tellraw @a [{"text":"[","color":"light_purple","bold":true},{"text":"Discord","color":"dark_purple","bold":true},{"text":"]","color":"light_purple","bold":true},{"text":" '+discordUser+'","color":"green","bold":false},{"text":">","color":"yellow","bold":true},{"text":" '+text.content+'","color":"aqua","hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"Sent from Discord using the RedDucks Duckling bot, made by ReduxRedstone!","color":"red"},{"text":"\nClick to download","color":"yellow"}]}},"bold":false}]',
    function(err, response) {
        if (err) {
            console.log(err);
        }
    });
});

// Advanced chat parsing function found in protocol example
function parseChat(chatObj, parentState) {
    function getColorize(parentState) {
        var myColor = "";
        if('color' in parentState) myColor += formatList[parentState.color] + "+";
        if(parentState.bold) myColor += "bold+";
        if(parentState.underlined) myColor += "underline+";
        if(parentState.obfuscated) myColor += "obfuscated+";
        if(myColor.length > 0) myColor = myColor.slice(0, -1);
        return myColor;
    }

    if(typeof chatObj === "string") {
        return color(chatObj, getColorize(parentState));
    } else {
        var chat = "";
        if('color' in chatObj) parentState.color = chatObj['color'];
        if('bold' in chatObj) parentState.bold = chatObj['bold'];
        if('italic' in chatObj) parentState.italic = chatObj['italic'];
        if('underlined' in chatObj) parentState.underlined = chatObj['underlined'];
        if('strikethrough' in chatObj) parentState.strikethrough = chatObj['strikethrough'];
        if('obfuscated' in chatObj) parentState.obfuscated = chatObj['obfuscated'];

        if('text' in chatObj) {
            chat += color(chatObj.text, getColorize(parentState));
        } else if('translate' in chatObj && dictionary.hasOwnProperty(chatObj.translate)) {
            var args = [dictionary[chatObj.translate]];
            chatObj['with'].forEach(function(s) {
                args.push(parseChat(s, parentState));
            });
            chat += color(util.format.apply(this, args), getColorize(parentState));
        }
        if (chatObj.extra) {
            chatObj.extra.forEach(function(item) {
                chat += parseChat(item, parentState);
            });
        }
        return chat;
    }
}

RedDucks.login("BOT KEY");