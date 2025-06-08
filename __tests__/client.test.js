require("dotenv/config");
const { ForgeClient } = require("@tryforge/forgescript");
const ForgePages = require("../dist/index.js");

const client = new ForgeClient({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  prefixes: ["."],
  extensions: [new ForgePages()]
});

// load your command folder
client.commands.load("__tests__/commands");
client.login(process.env.BOT_TOKEN); 