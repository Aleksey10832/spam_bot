import PrismaService from "./prisma.js";
import clientBot from "./client.js"
const client = new clientBot()
export default function sleepBot(){
    const prisma = new PrismaService()
    setInterval(async () => {
        const date = new Date()
        const bots = await prisma.getNotValidBots();
        bots.forEach(async (bot) => {
            const interval = new Date(date - bot.initDate);
            if(interval.getMinutes() >= 5){
                prisma.validationBot(bot.id)
                client.sendAdminMessage("Аккаунт с номером " + bot.phoneNumber + " готов к использованию")
            }
        });
    }, 20000)
}