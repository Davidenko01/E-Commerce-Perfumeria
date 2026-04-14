import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger('Prisma-project');

    // Conectar a la base de datos al iniciar el módulo
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
            this.logger.error('Failed to connect to the database', error);
            throw error;
        }
        this.logger.log('Connected to the database');
    }

    // Desconectar de la base de datos al destruir el módulo
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Disconnected from the database');
    }

}
