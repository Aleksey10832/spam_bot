import { Telegraf } from "telegraf";
import { WizardScene } from "telegraf/scenes";
import { Stage } from "telegraf/scenes";
import { session } from "telegraf";
import PrismaService from "./prisma.js";
import fs from 'fs'
// fs.writeFileSync('./storage.json', JSON.stringify({aboba: 'huy'}))
// console.log(JSON.parse(fs.readFileSync('./storage.json')))

async function startClientBot(){
    const prismaService = new PrismaService()
    const client = new Telegraf(process.env.CLIENT_BOT_TOKEN)
    async function guard(ctx){
        const user = await prismaService.getAdminByChatId(ctx.chat.id)
        if(!user){
            return false
        }
        return true
    }
    const auth = new WizardScene('auth_token', (ctx) => {
        ctx.reply('Введите токен')
        ctx.wizard.next()
    }, async (ctx) => {
        if(ctx.text == process.env.ADMIN_TOKEN){
            const user = await prismaService.createAdmin(ctx.chat.id.toString())
            if(user == 'P2002') {
                ctx.reply('Вы уже авторизованы')
            } else {
                ctx.reply('Успешная авторизация')
            }
        } else {
            ctx.reply('Неверный токен')
        }
        ctx.scene.leave()
    })
    const newSpamBot = new WizardScene('new_spam_bot', (ctx) => {
        ctx.reply('Введите api_id')
        ctx.wizard.next()
    }, (ctx) => {
        ctx.reply('Введите api_hash')
        fs.writeFileSync(`./spam_bots/${ctx.chat.id}.json`, JSON.stringify({id: ctx.chat.id, api_id: ctx.message.text, api_hash: undefined, phone_number: undefined}), {flag: 'w'})
        ctx.wizard.next()
    }, async (ctx, bib) => {
        console.log(await bib())
        // const spam_bot
        ctx.scene.leave()
    })

    const stage = new Stage([auth, newSpamBot])
    client.use(session())
    client.use(stage.middleware())

    client.command('start', (ctx) =>{
        ctx.scene.enter('auth_token')
    })
    client.command('new_spam_bot', async (ctx)=>{
        if(await guard(ctx)){
            ctx.scene.enter('new_spam_bot')
        } else{
            ctx.reply("У вас недостаточно прав на использование этой функции")
        }
    })

    
    
    client.launch()
}
export default startClientBot