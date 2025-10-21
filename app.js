import dotenv from "dotenv";
import startClientBot from "./src/client.js";
import ClientBot from "./src/client.js";
import sleepBot from "./src/sleepBot.js";
dotenv.config({path: './.env'});
sleepBot()
const client = new ClientBot()
client.startClientBot();
