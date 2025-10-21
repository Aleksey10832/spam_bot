import { PrismaClient } from "@prisma/client"

export default class PrismaService {
    static prisma = new PrismaClient();

    async getAdminByChatId(id) {
        if(typeof id != 'string'){
            return await PrismaService.prisma.admin.findUnique({where: {telegramId: id.toString()}})
        }
        return await PrismaService.prisma.admin.findUnique({where: {telegramId: id}}) 
    }

    async createAdmin(id) {
        if(id && typeof id == 'string') {
            try {
                return await PrismaService.prisma.admin.create({data: {telegramId: id}})
            } catch {
                return 'P2002'
            }
        } else {
            return undefined
        }
    }

    async createSession(spamBot){
        return await PrismaService.prisma.spamBot.upsert({
            where: {apiId: spamBot.apiId.toString()}, 
            update: {
                apiHash: spamBot.apiHash,
                phoneNumber: spamBot.phoneNumber,
                password: spamBot.password,
                session: spamBot.session,
                isAuth: spamBot.isAuth,
                banStatus: spamBot.banStatus,
                sleepOk: spamBot.sleepOk,
                initDate: spamBot.initDate
            },
            create: {
                apiId: spamBot.apiId.toString(),
                apiHash: spamBot.apiHash,
                phoneNumber: spamBot.phoneNumber,
                password: spamBot.password,
                session: spamBot.session,
                isAuth: spamBot.isAuth,
                banStatus: spamBot.banStatus,
                sleepOk: spamBot.sleepOk,
                initDate: spamBot.initDate
            }
        })
    }

    async getAuthSessions(){
        return await PrismaService.prisma.spamBot.findMany({where: {isAuth: true, banStatus: false}})
    }
    async getAuthSession(){
        return await PrismaService.prisma.spamBot.findFirst({where: {isAuth: true, banStatus: false}})
    }
    async uploadUsers(users){
        return await PrismaService.prisma.user.createMany({data: users})
    }
    async getNotValidBots(){
        return await PrismaService.prisma.spamBot.findMany({where: {sleepOk: false}})
    }
    async validationBot(id){
        return await PrismaService.prisma.spamBot.update({where: {id: id}, data: {sleepOk: true}})
    }
    async getAdminsId(){
        return (await PrismaService.prisma.admin.findMany()).map(el => el.telegramId)
    }
}

