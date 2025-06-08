import "dotenv/config";
import { ForgeClient } from "@tryforge/forgescript";
import ForgePages from "../dist/index.js";

const client = new ForgeClient({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  prefixes: ["."],
  extensions: [new ForgePages()]
});

// load your command folder
client.commands.load("__tests__/commands");
client.login(process.env.BOT_TOKEN!); 