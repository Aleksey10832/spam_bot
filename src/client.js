import { Telegraf } from "telegraf";
import { WizardScene } from "telegraf/scenes";
import { Stage } from "telegraf/scenes";
import { session } from "telegraf";
import PrismaService from "./prisma.js";
import initBot from "./initBot.js";
import fs from 'fs'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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
    }, 
    (ctx) => {
        try {
            fs.writeFileSync(`./spam_bots/${ctx.chat.id}.json`, JSON.stringify({id: ctx.chat.id, api_id: +ctx.message.text, api_hash: undefined, phone_number: undefined, password: undefined, code: undefined}))
        } catch {
            ctx.reply('api_id невалиден')
        }
        ctx.reply('Введите api_hash')
        ctx.wizard.next()
    }, 
    async (ctx) => {
        ctx.reply('Введите номер телефона')
        const spam_bot = JSON.parse(fs.readFileSync(`./spam_bots/${ctx.chat.id}.json`))
        spam_bot.api_hash = ctx.message.text
        editBotInJson(ctx, spam_bot)
        ctx.wizard.next()
    }, 
    async (ctx) => {
        ctx.reply('Введите пароль(при отсутствии введите -)')
        const spam_bot = JSON.parse(fs.readFileSync(`./spam_bots/${ctx.chat.id}.json`))
        spam_bot.phone_number = ctx.message.text
        editBotInJson(ctx, spam_bot)
        ctx.wizard.next()
    }, 
    async (ctx) => {
        ctx.reply('Введите код для входа')
        const spam_bot = JSON.parse(fs.readFileSync(`./spam_bots/${ctx.chat.id}.json`))
        spam_bot.password = ctx.message.text
        editBotInJson(ctx, spam_bot)
        initBot(ctx.chat.id)
        ctx.wizard.next()
    }, 
    async (ctx) => {
        const spam_bot = JSON.parse(fs.readFileSync(`./spam_bots/${ctx.chat.id}.json`))
        spam_bot.code = ctx.message.text
        editBotInJson(ctx, spam_bot)
        await sleep(3500)
        try{
            fs.readFileSync(`./spam_bots/${ctx.chat.id}.json`)
            ctx.reply('Ошибка при инициализации нового спам бота')
        } catch{
            ctx.reply('Спам бот успешно инициализирован')
        }
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
            ctx.reply("У вас недостаточно прав на использование этой команды")
        }
    })

    
    function editBotInJson(ctx, bot){
        fs.writeFileSync(`./spam_bots/${ctx.chat.id}.json`, JSON.stringify(bot))
    }   
    client.launch()
}
export default startClientBot