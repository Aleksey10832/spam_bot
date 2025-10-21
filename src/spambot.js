import PrismaService from './prisma.js';
import { TelegramClient, Api, password } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import fs from 'fs'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export default class SpamBot{
    async checkGroupUsers(url, userId){
        const prisma = new PrismaService()
        const user = await prisma.getAuthSession()
        if(url.split('+')[0] == "https://t.me/"){
            url = url.split('+')[1]
        }
        const client = new TelegramClient(new StringSession(user.session), +user.apiId, user.apiHash, {connectionRetries: 5,});
        await client.connect()
        try{
            const group = await client.invoke(new Api.messages.ImportChatInvite({hash: url}))
            console.log(group.users.map(el => el.id.toString()))
        } catch{
            const count = (await client.invoke(new Api.channels.GetParticipants({channel: url, filter: new Api.ChannelParticipantsRecent(), offset: 0, limit: 1}))).count
            const limitNumbr = count % 150
            let currentCount = 0
            for (let i = 0; i < Math.floor(count / 150); i++){
                if (i == 67){
                    break;
                }
                const group = await client.invoke(new Api.channels.GetParticipants({
                    channel: url, 
                    filter: new Api.ChannelParticipantsRecent(),
                    offset: i * 150,
                    limit: 150
                }))
                const userList = group.users.map(el => {
                    return {
                        telegramId: el.id.toString(),
                        lastMessage: "none",
                        isOk: true
                    }})
                await prisma.uploadUsers(userList)
                currentCount += userList.length
                fs.writeFileSync(`./process/${userId}.json`, JSON.stringify(
                    {count: currentCount, isEnd: false, max: count}
                ))
                await sleep(1000)
            }
            const group = await client.invoke(new Api.channels.GetParticipants({
                channel: url, 
                filter: new Api.ChannelParticipantsRecent(),
                offset: Math.floor(count, 150),
                limit: limitNumbr,
                hash: BigInt("-4156887774564"),
            }))
            await prisma.uploadUsers(group.users.map(el => {
                return {
                    telegramId: el.id.toString(),
                    lastMessage: "none",
                    isOk: true
                }
            }))
            fs.writeFileSync(`./process/${userId}.json`, JSON.stringify(
                {count: count, isEnd: true, max: count}
            ))
        }
    }
}