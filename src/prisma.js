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
            where: {apiId: spamBot.apiId}, 
            update: {
                apiHash: spamBot.apiHash,
                phoneNumber: spamBot.phoneNumber,
                password: spamBot.password,
                session: spamBot.session,
                isAuth: spamBot.isAuth,
                banStatus: spamBot.banStatus
            },
            create: {
                apiId: spamBot.apiId,
                apiHash: spamBot.apiHash,
                phoneNumber: spamBot.phoneNumber,
                password: spamBot.password,
                session: spamBot.session,
                isAuth: spamBot.isAuth,
                banStatus: spamBot.banStatus
            }
        })
    }
}

