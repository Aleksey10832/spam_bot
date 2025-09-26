import dotenv from "dotenv";
import { TelegramClient } from "telegram";
import startClientBot from "./src/client.js";
dotenv.config({path: './.env'});
startClientBot();