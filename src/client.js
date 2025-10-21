import { Telegraf } from "telegraf";
import { WizardScene } from "telegraf/scenes";
import { Stage } from "telegraf/scenes";
import { session } from "telegraf";
import PrismaService from "./prisma.js";
import initBot from "./initBot.js";
import fs, { writeFileSync } from 'fs'
import SpamBot from "./spambot.js";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class ClientBot {
    async startClientBot(){
        const spamBot = new SpamBot();
        const prismaService = new PrismaService();
        const client = new Telegraf(process.env.CLIENT_BOT_TOKEN, {handlerTimeout: 300000})
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
        const checkGroupUsers = new WizardScene('check_group_users', (ctx) => {
            ctx.reply('Введите url группы')
            ctx.wizard.next()
        }, async (ctx) => {
            writeFileSync(`./process/${ctx.chat.id}.json`, JSON.stringify({count: 0, isEnd: false, max: 1}))
            spamBot.checkGroupUsers(ctx.message.text, ctx.chat.id)
            let mess = await ctx.reply("Загрузка пользователей")
            let isProcess = true
            let info
            let lastText = "Загрузка пользователей"
            
            while(isProcess){
                await sleep(300)
                info = JSON.parse(fs.readFileSync(`./process/${ctx.chat.id}.json`))
                
                const newText = `Загружено ${info.count}/${info.max} пользователей`
                
                if (newText !== lastText) {
                    try {
                        mess = await ctx.telegram.editMessageText(
                            ctx.chat.id, 
                            mess.message_id, 
                            null, 
                            newText
                        )
                        lastText = newText
                    } catch (error) {
                        if (error.response && 
                            error.response.description && 
                            error.response.description.includes('message is not modified')) {
                            console.log('Сообщение не изменилось, пропускаем...')
                        } else {
                            console.log('Ошибка редактирования:', error.message)
                        }
                    }
                }
                
                isProcess = !info.isEnd
            }
            fs.rm(`./process/${ctx.chat.id}.json`, ()=>{})
            ctx.scene.leave()
        })
        const stage = new Stage([auth, newSpamBot, checkGroupUsers])
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
        client.command('check_group_users', async (ctx) => {
            if(await guard(ctx)){
                ctx.scene.enter('check_group_users')
            } else{
                ctx.reply("У вас недостаточно прав на использование этой команды")
            }
        })
        
        function editBotInJson(ctx, bot){
            fs.writeFileSync(`./spam_bots/${ctx.chat.id}.json`, JSON.stringify(bot))
        }   
        client.launch()
    }
    async sendAdminMessage(message){
        const prismaService = new PrismaService();
        const client = new Telegraf(process.env.CLIENT_BOT_TOKEN, {handlerTimeout: 300000})
        const ids = await prismaService.getAdminsId()
        ids.forEach(async (el) => {
            await client.telegram.sendMessage(+el, message)
        })
    }
}