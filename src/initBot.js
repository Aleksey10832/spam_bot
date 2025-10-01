
import fs from 'fs'
import { TelegramClient } from "telegram";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
import { StringSession } from "telegram/sessions/index.js";
import PrismaService from './prisma.js';
const initBot = async (id) => {
  try{
    const user = JSON.parse(fs.readFileSync(`./spam_bots/${id}.json`))
    const client = new TelegramClient(new StringSession(""), user.api_id, user.api_hash, {
      connectionRetries: 5,
    });
    await client.start({
      phoneNumber: () => user.phone_number,
      password: () => user.password,
      phoneCode: async () => {
          for(let i = 0; i <= 100; i++){
              const code = JSON.parse(fs.readFileSync(`./spam_bots/${id}.json`)).code
              if(code){
                  return code
              }
              await sleep(3000)
          }
      }
    });
    const session = client.session.save()
    fs.rm(`./spam_bots/${id}.json`, (err)=>{})
    const prismaService = new PrismaService()
    console.log(await prismaService.createSession({
      apiId: user.api_id,
      apiHash: user.api_hash,
      phoneNumber: user.phone_number,
      password: user.password,
      session: session,
      isAuth: true,
      banStatus: false
    }))
  } catch{}
}
export default initBot