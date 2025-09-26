import dotenv from "dotenv";
import startClientBot from "./src/client.js";
dotenv.config({path: './.env'});
startClientBot();
