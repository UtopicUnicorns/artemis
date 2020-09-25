const { Client, Collection } = require("discord.js");
const Util = require("./Util.js");
const Logger = require("@ayana/logger");

module.exports = class ArtemisClient extends Client {
  constructor(config) {
    super({
      disableEveryone: false,
      disabledEvents: ["TYPING_START"],
    });

    this.commands = new Collection();
    this.aliases = new Collection();

    this.utils = new Util(this);

    this.queue = new Map();

    this.logger = Logger.get(ArtemisClient);

    this.config = config;

    this.on("message", async (message) => {
      if (!message.guild || message.author.bot) return;

      const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

      const command =
        this.commands.get(cmd.toLowerCase()) ||
        this.commands.get(this.aliases.get(cmd.toLowerCase()));
      if (command) {
        command.run(message, args);
      }
    });
  }
  validate(options) {
    if (typeof options !== "object")
      throw new TypeError("Options should be a type of Object.");

    if (!options.token)
      throw new Error("You must pass the token for the client.");
    this.token = options.token;

    if (!options.prefix)
      throw new Error("You must pass a prefix for the client.");
    if (typeof options.prefix !== "string")
      throw new TypeError("Prefix should be a type of String.");
    this.prefix = options.prefix;
  }

  async start(token = this.token) {
    this.utils.loadCommands();
    super.login(token);
    this.logger.info(`Logged in as ${this.user.username}`);
  }
};
