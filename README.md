# Artemis Wiki
_Oh god, another thing Artemis may be controlling_


## Index
* [Index](#Index)
   * [Getting_Started](#Getting_Started)
      * [Adding_the_bot](#Adding_the_bot)
      * [Small_overview](#Small_overview)
      * [Setting_up_the_channels](#Setting_up_the_channels)
      * [Reaction_Roles](#Reaction_Roles)
      * [Mute_Channel](#Mute_Channel)
      * [Credits](#Credits)
   * [Commands](#Commands)
      * [Mod_Commands](#Mod_Commands)
         * [Approve](#Approve)
         * [Ban](#Ban)
         * [Case](#Case)
         * [Embed](#Embed)
         * [ForceRemove](#ForceRemove)
         * [Kick](#Kick)
         * [Mute](#Mute)
         * [Nick](#Nick)
         * [Purge](#Purge)
         * [Support](#Support)
         * [Topic](#Topic)
         * [Unmute](#Unmute)
         * [UserData](#UserData)
         * [Uwu](#Uwu)
         * [Warn](#Warn)
         * [Warnings](#Warnings)
      * [Server_Commands](#Server_Commands)
         * [Automod](#Automod)
         * [Check](#Check)
         * [React](#React)
         * [Wordlist](#Wordlist)
      * [Mscore_Commands](#Mscore_Commands)
         * [Add](#Add)
         * [Rolemanage](#Rolemanage)
      * [General_Commands](#General_Commands)
         * [Help](#Help)
         * [Info](#Info)
         * [Invite](#Invite)
         * [Opt](#Opt)
         * [Ping](#Ping)
         * [Remindme](#Remindme)
         * [Search](#Search)
         * [Userinfo](#Userinfo)
      * [Level_Commands](#Level_Commands)
         * [Board](#Board)
         * [Join](#Join)
         * [Leave](#Leave)
         * [Level](#Level)
         * [Numbers](#Numbers)
      * [Linux_Commands](#Linux_Commands)
         * [Ask](#Ask)
         * [Btw](#Btw)
         * [Linus](#Linus)
         * [Man](#Man)
         * [Package](#Package)
         * [Proton](#Proton)
         * [Rms](#Rms)
         * [Specs](#Specs)
      * [Fun_Commands](#Fun_Commands)
         * [Avatar](#Avatar)
         * [Bird](#Bird)
         * [Cat](#Cat)
         * [Catfact](#Catfact)
         * [Convert](#Convert)
         * [Dog](#Dog)
         * [Emoji](#Emoji)
         * [Fbi](#Fbi)
         * [Fox](#Fox)
         * [Honk](#Honk)
         * [Hug](#Hug)
         * [Lenny](#Lenny)
         * [P](#P)
         * [Wallpaper](#Wallpaper)
         * [Wiki](#Wiki)
         * [Xkcd](#Xkcd)
      * [Stream_Commands](#Stream_Commands)
         * [Stream](#Stream)
      * [Music_Commands](#Music_Commands)
         * [Np](#Np)
         * [Pause](#Pause)
         * [Play](#Play)
         * [Resume](#Resume)
         * [Skip](#Stop)
         * [Stop](#Stop)
         * [Vol](#Vol)


## Getting_Started
_To even begin you need to make sure you are actually allowed to add bots to your server_

### Adding_the_bot
Adding the bot is simple, you either hit the button `Add Bot` on:
* [https://artemisbot.eu/](#https://artemisbot.eu/)

Or you use the direct link: 
* [https://discord.com/oauth2/authorize?client_id=440892659264126997&permissions=8&scope=bot](#https://discord.com/oauth2/authorize?client_id=440892659264126997&permissions=8&scope=bot)

### Small_overview
Artemis is a multi-function bot.
* Moderation
* Warn system
* Case sytem
* Translation
* Internet Search
* Verification
* And more...

### Setting_up_the_channels
Go to [https://artemisbot.eu/](#https://artemisbot.eu/) and login there.
Click `Server Control`,
choose the server you want to modify, then scroll down to `Channels`.

* Welcome
   * This channel is used to display the welcome message for new users

* Logs
   * This channel is used to display several type of logs.

* Mute/Verify
   * This channel is used to verify new users and store muted members. For this channel to be effective, you need to use the role provided by Artemis `~/members` and give ONLY THIS role access to channels you would want to be locked. When a user gets muted, all those channels will be invisible for the muted user, and verifying users may get access to these channels if they pass the captcha.

* Highlights
   * When a message in one of the channels gets 3 :tea: emotes, the bot will try to highlight it. This channel will be used to store highlighted messages.

* Reaction Roles
   * This channel will be used to use reaction roles. Make sure that this channel is completely empty apart from the message(s) containing the role emotes.

* Stream Notification
   * This channel will be used to display if a user goes live on Twitch.

### Reaction_Roles
_This is gonna get complicated oh boi._

I am going to make this a sort of step by step guide for the ease of it, follow along Pond.

* Setup your Reaction Role Channel.
* Pick a role you want to be self-assignable.
* Use the command [Rolemanage](#Rolemanage) to make it self asignable
* Create a new emoji (This has to be a custom emote), and give it the EXACT same name as the role you made self-asignable
* Go to the channel which you picked for the reaction role channel.
* Place a message there (You can use [Embed](#embed)), it does not matter what the message is, but perhaps information of what the role does.
* Right click the message you just made and select `copy ID`.
* Now it's time to use [React](#React), use the ID on your clipboard as messageID and the emoji name you created which should be the exact same name as your role.
* If everything went well a new reaction should be under the message of which you copied the ID from.
* Click it to test if it worked.
* If Artemis sends a message like `Joined ****` then you are done here, you setup a reaction role.

### Mute_Channel
This channel is also used for verification, time to pay some attention.

When Artemis first joins a new Guild, she will create a role called `~/Members`.
This is the role she gives out to new users (or users who verified), and takes away from users who get muted.

Make absolutely sure that only users with the role `~/Members` have access to the channels you want them to see if they verify.
If you did this right, then both muting and verifying should work just fine.

### Credits
Artemis was created by:

 Richard Dorrestijn

 [dorrestijn.r@gmail.com](mailto:dorrestijn.r@gmail.com)

 Discord: UtopicUnicorn#0383

A big thanks goes out to all the MIT licensed projects that I used as reference guides, and of course to Stack Exchange.

## Commands
This section will cover the commands Artemis has.
Note that not every command may be available, because I don't update this guide quite as much as my bot.
My apologies about that.

All of the commands below require you to use a prefix in front of them, which you can setup on [https://artemisbot.eu](https://artemisbot.eu).

Example: `!help`

In this guide/wiki, I am using the `!` prefix, this is of course changeable on the Artemis website.

## Mod_Commands
_Mod commands need the user who uses the commands to have at least kick permissions, and Artemis needs proper permissions. To simplify everything, it might be best to give Artemis administrator permissions, which she prompts when getting added to a server._

### Approve
When you have a verify channel set up, and you have AutoMod on Strict mode (Which prevents verifying), you can use this command to manually approve users.
This is also the command you want to use when a user has bad eyesight, to the point where they cannot see the captcha.

Example usage: `!verify @mention`

### Ban
Using this command will try to ban a user or users. 
Do note that Artemis needs valid permissions, and needs to be above the user in the role hierachy.
Using this command will also create a [Case](#Case).

Example usage: `!ban @mention [Reason for the ban]`

Example usage: `!ban @mention @mention @mention`

Example usage: `!ban userID userID userID`

### Case
Cases are automatically generated when using certain commands.
A case is used to keep track of the baddies.

Example usage: `!case view caseNum`

Example usage: `!case user userID`

Example usage: `!case reason caseNum [Reason here]`

### Embed
Embeds are used to make some text look prettier.
The first line contains the embed title, the rows/lines after that will be the content of the embed.
Do note that this command needs you to use newLines (Shift + enter).


Example usage: 

``` sh
!embed [Title]

[Content]

[Content]

[Content]
```

### ForceRemove
This is a dangerous command, for it allows you to remove a user's data from the database as long as the user is within your guild.
This means that all user records such as warnings, last warning message, user level, user points, and if the user is muted will be removed.

Example usage: `!forceremove userID`

### Kick
This command will attempt to kick the user you specify.
To properly use this command, make sure that Artemis is in a higher role hierachy slot than the user you try to kick.
Using this command will also generate a [Case](#Case).

Example usage: `!kick @mention`

### Mute
This command will mute the user you specify.
The action will create a [Case](#Case).
Do note that without proper role permissions and channel permissions, this command will fail.
This is explained in [Mute_Channel](#Mute_Channel).

Example usage: `!mute @mention`

Example usage: `!mute 5 hour @mention`

Example usage: `!mute 5 second @mention`

Example usage: `!mute 5 minute @mention`

Example usage: `!mute 5 day @mention`

### Nick
Nick will allow you to change a user's nickname.

Example usage: `!nick @mention [New Nick Name]`

### Purge
Purging is one of the main features of a Discord bot.
This command will wipe a specified ammount of messages from the channel you use it in.
Due to API limitations, you can only purge 100 messages at a time, and only up to 2 weeks ago.
Artemis allows you to purge from a mentioned user too, or a keyword which will remove up to 100 messages containing that word.

Example usage: `!purge 100`

Example usage: `!purge @mention 100`

Example usage: `!purge KeyWord 100`

### Support
The support command is used to view, edit and set support related things.
Support cases are shared across any server, basically creating a sort of stackexchange-like system.
You do not need to have support channels set up to view cases.

To accept support cases you will have to use the command `!support set` within the channel you wish to make a support channel (The same command will also unset the support channel).
Now that you have a support channel set up, your members will simply have to say `help` inside the support channel. They will then be prompted to ask their question.
When the a submits their question, the support case will be opened, and users may help the user who opened the question.
When the session is done ,(user uses the command `!done` or lets the case expire), the user who answered the question should use `!support answer caseNum [Answer here]` to add their answer to the database.

Example usage: `!support set`

Example usage: `!support view caseNum`

Example usage: `!support answer caseNum [Answer here]`

Example usage: `!support user @mention`

### Topic
The topic command is used to change the topic of a situation. This topic is completely unrelated from mostly anything else.

Example usage: `!topic`

### Unmute
This command will unmute the mentioned member, which will generate a [Case](#Case).
Users who have been properly muted will have their warning points reset after being unmuted.
Their reasons (if given) do not get reset in the case system.

Example usage: `!unmute @mention [Reason]`

### UserData
Within the Artemis Bot Network are many servers which cover related topics (in Artemis's case, it's space related and Linux related).
Related servers often attract users from the same pool, userdata simply tells you if a user has been misbehaving in other servers. It will not show actual data of the user, only how many times a user has been warned, and if the user has been muted in a server Artemis is also in.

Example usage: `!userdata userID`

### Uwu
This command makes use of existing webhooks, if there is no webhook in the channel you have set this up, Artemis will create one if possible.
This command will convert all messages sent within the server it has been setup in to be converted to `uwu` speech.
It's a horrible thing, but people love it.

Example usage: `!uwu`

### Warn
This command will warn a user,  and will also generate a [Case](#Case).
When a user is warned ,the warning point table for the user will increase by 1.
When a user has 3 or more warning points, with a properly set up muting channel, and the `~/Members` role has been properly applied to the channels, the user will be muted.

Example usage: `!warn @mention [Reason]`

### Warnings
This command allows you to see how many warnings a user has and what the latest reason of a warn was.
It will also show if a user has been muted.
An additional usage of this command is that it can reset warnings to 0.

Example usage: `!warnings`

Example usage: `!warnings @mention`

Example usage: `!warnings @mention reset`

## Server_Commands
_Server commands need the user who uses them to have at least kick permissions, and Artemis needs proper permissions. To simplify everything it might be best to give Artemis administrator permissions, which she prompts when getting added to a server._

### Automod
Automod is a tool which can help moderators out a little bit in their daily tasks,

Automod includes:
* A word filter (Filters are guild/server specific and will have to be setup by using the [Wordlist](#Wordlist) command)
* Anti discord invites
* Anti spam
* Anti mention (If a user scrapes a list of users and uses that to mention everyone, if done twice, that user gets muted.)
   * Anti Verification (if Strict mode is on)

Strict mode is used against raids, or when you want users to be verified manually by using [Approve](#Approve)

Example usage: `!automod`

Example usage: `!automod on`

Example usage: `!automod off`

Example usage: `!automod strict`

### Check
This command allows you to see which users in your guild/server have or don't have a certain role you specify.

Example usage: `!check yes roleName`

Example usage: `!check not roleName`

### React
This command is a core command for [Reaction_Roles](#Reaction_Roles).

This command only accepts CUSTOM emojis. You can add as many to this command as a message can hold.
When used properly, the React command will react to the message you specified with the specified emojis.

_The react command in combination with the message ID should ONLY be used WITHIN the channel the message originates from._

Example usage: `!react MessageID EmojiName EmojiName EmojiName`

### Wordlist
This is a core command for [Automod](#Automod).

Without arguments the wordlist will be shown. To somewhat protect people from seeing bad words, the wordlist will be shown within spoiler tags.
When you add words to the list, and when Automod is ON, users without the kick permission will get their full message removed without notice when they use a word on the list.
This system is not perfect and is not meant to be used as your main moderator.

Example usage: `!wordlist add Word1 Word2 Word3`

Example usage: `!wordlist del Word1 Word2 Word3`

## Mscore_Commands
_Mscore commands need the user who uses the commands to have at least kick permissions, and Artemis needs proper permissions. To simplify everything, it might be best to give Artemis administrator permissions, which she prompts when getting added to a server._

### Add
This command allows you to gift or retract points from a user if leveling is enabled for your guild/server.

Example usage: `!add @mention -100` _Note the minus symbol_

Example usage: `!add @mention 100`

### Rolemanage
This is a semi-core command for [Reaction_Roles](#Reaction_Roles).

This command will allow you to add or remove a role from the self-asignable role list.
When a role is self-asignable, a user may use `!join` or `!leave` to obtain and remove the role for themselves.
Do note that Artemis's role needs to be higher in the role hierachy than the role you try to add/remove.
Using this command with success will add the role to the list if it was not there, and remove it from the list if it was.
You can check which roles are self-asignable with the [Numbers](#Numbers) command.

Example usage: `!rolemanage RoleName`

## General_Commands
_Commands in this category do not need special permissions_

### Help
This command will show the user a help menu which is only controllable by the user who called for it.
It will show every command available, sorted into categories.
Users can also have a command explained by adding the command's name to the help command.

Example usage: `!help`

Example usage: `!help rolemanage` _This will explain the command named rolemanage_

### Info
This command will show the user detailed information about the guild/server they are in.

Example usage: `!info`

### Invite
This is basically self promotion for me.
This command shows my GitHub, Paypal, Website, my main Discord Server, as well as my username with discriminator.
It will also hold a link to add Artemis to your own server.

Example usage: `!invite`

### Opt
This will show the user if they have Autotranslation on for themselves.
They can change this on the Artemis website if they please, by default this is off.

Example usage: `!opt`

### Ping
This is just a ping command, checks the lag between messages...

Example usage: `!ping`

### Remindme
This is a command that allows the user to set a reminder for themselves.
When the time comes for them to be reminded, they will be pinged in the channel they used the command in.
Using the command without arguments will show you how to use the command, as well as active reminders.

Example usage: `!remindme`

Example usage: `!remindme 10 hours [reminder]` _Seconds, minutes and hours are supported_

Example usage: `!remindme delete clear` _Delete all reminders for yourself_

Example usage: `!remindme delete DeletionKey` _Delete only the reminder matching the deletion key_

### Search
This command allows you to search google... within Discord...

Example usage: `!search [keywords]`

### Userinfo
This command will show you detailed info about yourself, or a specified user.
It can also be used in combination with [Specs](#Specs) to share your system info.

Example usage: `!userinfo`

Example usage: `!userinfo @mention`

Example usage: `!userinfo userID`

## Level_Commands
_Commands in this category do not need special permissions_

### Board
This command will show the leader board regarding points and levels.
It also holds a small competative rank vs other servers with Artemis.

Example usage: `!board`

### Join
Users can use this command when there are self-assignable roles.
This command will give the user the coresponding role if it exists.

Example usage: `!join RoleName`

### Leave
Users can use this command when there are self-assignable roles.
This command will take away the coresponding role from the user if it exists.

Example usage: `!leave RoleName`

### Level
This command will show a neat graphic card with level/points info, as well as warnings, for the user who uses this command.
You can also specify it further by providing an userID or @mention.

Example usage: `!level`

Example usage: `!level @mention`

Example usage: `!level userID`

### Numbers
This command is a core command for [Rolemanage](#Rolemanage).

When this command is used it will show all available self-assignable roles along with the number of members who have that role.

Example usage: `!numbers`

## Linux_Commands
_Commands in this category do not need special permissions_

### Ask
This command will pull an available question from AskUbuntu using their API.
It is a garbage API though, so just use search.

Example usage: `!ask [question]`

### Btw
This command has a distribution list of 900+ entries.
When this command is used, it will display a random distribution from the list in the classical `I am using Arch BTW` format.

Example usage: `!btw`

### Linus
This command will show one part of a 2 part story between RMS and linus.

Example usage: `!linus`

### Man
This command allows you to view manual pages provided by cheat.sh

Example usage: `!man neofetch`

### Package
This command allows users to see if a package they need/looking for is available in the Arch repos, or the Ubuntu repos.

Example usage: `!package arch [packageName]`

Example usage: `!package ubuntu [packageName]`

### Proton
This command will search the Proton Database and Steam API for the game you specify.
It will show if a game is native to Linux, or if Proton partially or fully supports it.

Example usage: `!proton subnautica`

### Rms
This command will show one part of a 2 part story between RMS and linus.

Example usage: `!rms`

### Specs
This command will allow you to upload a piece of text to your [Userinfo](#Userinfo).
Users typically use this command to share their system specification.

Example usage: 

```sh
!specs neofetch
output
output
```

## Fun_Commands
_Commands in this category do not need special permissions_

### Avatar
This command will show the user their own, or a specified user's profile picture.

Example usage: `!avatar`

Example usage: `!avatar @mention`

### Bird
This command will show a random bird picture.

Example usage: `!bird`

### Cat
This command will show a random cat picture.
These cats are my own.

Example usage: `!cat`

### Catfact
This command will show the user a random cat fact.

Example usage: `!catfact`

### Convert
This command allows you to convert:

* CM to Inch
* Inch to CM
* Celcius to Fahrenheit
* Fahrenheit to Celcius


Example usage: `convert NUM cm`

Example usage: `convert NUM inch`

Example usage: `convert NUM celcius`

Example usage: `convert NUM fahrenheit`

### Dog
This command will show the user a random dog picture.

Example usage: `!dog`

### Emoji
This command will show a bigger version of an emoji you specify.

Mods will have an extra feature that adds an emoji right to your own server. The syntag might be a tad tricky, but the API is limited in this way.


Example MOD usage: `!emoji steal https://someurl.com/gif.gif EmoteName`

Example usage: `!emoji :glitch:`

### Fbi
This will show a random wanted poster for yourself, or the user you specify.

Example usage: `!fbi`

Example usage: `!fbi @mention`

### Fox
This command will show you a random fox picture.

Example usage: `!fox`

### Honk
This command will show the user a random geeko picture, honk honk.

Example usage: `!honk`

### Hug
This will display an image as if hugging the specified user.

Example usage: `!hug @mention`

### Lenny
_RESTRICTED COMMAND, CONTACT ME IF YOU NEED ACCESS_

Example usage: `!lenny`

### P
This will fully load a webpage within the bot's code, then return the loading speed to the user.

Example usage: `!p https://artemisbot.eu`

### Wallpaper
A small collection of single and double screen wallpapers.
The command will return a random wallpaper.

Example usage: `!wallpaper s` _Single screen wallpaper_

Example usage: `!wallpaper d` _Double screen wallpaper_

### Wiki
This command will provide a small description of a specified Wikipedia page.

Example usage: `!wiki GNU/Linux`

### Xkcd
This command will show you an XKCD comic.

Example usage: `!xkcd` _Shows the most recent comic_

Example usage: `!xkcd NUMBER` _Shows the specified comic coresponding to the number you provided_

Example usage: `!xkcd random` _Shows a random comic_

## Stream_Commands
_Commands in this category do not need special permissions_

### Stream
This will show if a notification in a set stream channel will show up for the user.
This can be changed on the Artemis website, by default this is ON.

Example usage: `!stream`

## Music_Commands
_Commands in this category do not need special permissions_

### Np
Shows the queue if there is music playing.

Example usage: `!np`

### Pause
Pauses the music player.

Example usage: `!pause`

### Play
Plays a specified song, or adds it to the queue if there is a song currently playing.

Example usage: `!play YtURL`

Example usage: `!play Search Query`

### Resume
If the music player was paused, this command will resume it.

Example usage: `!resume`

### Skip
Skips the song that is currently playing.
If you provide the coresponding song number provided by [Np](#Np), it will skip that song.

Example usage: `!skip`

Example usage: `!skip 4` _This skips the 4th song in the queue_

### Stop
This will stop the music player.

Example usage: `!stop`

### Vol
This will change the volume of the music player from 1-100

Example usage: `!vol NUM`
