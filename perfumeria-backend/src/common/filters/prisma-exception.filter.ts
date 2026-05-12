import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message } = this.mapPrismaError(exception);

    // Log the complete error for debugging purposes
    this.logger.error(
      `Prisma error ${exception.code}: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: this.getErrorName(status),
      timestamp: new Date().toISOString(),
    });
  }

  private mapPrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): { status: number; message: string } {
    switch (exception.code) {
      case 'P2002': {
        const fields = this.extractUniqueFields(exception);
        return {
          status: HttpStatus.CONFLICT,
          message: `Ya existe un registro con ese valor en: ${fields}`,
        };
      }

      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'El registro solicitado no existe',
        };

      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referencia inválida: el recurso relacionado no existe',
        };

      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'La operación viola una relación requerida',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error interno del servidor',
        };
    }
  }

  private getErrorName(status: number): string {
    const map: Record<number, string> = {
      400: 'Bad Request',
      404: 'Not Found',
      409: 'Conflict',
      500: 'Internal Server Error',
    };
    return map[status] ?? 'Error';
  }

  private extractUniqueFields(exception: Prisma.PrismaClientKnownRequestError): string {
    // CASO 1: meta.target como array → ['email']
    const target = exception.meta?.target;
    if (Array.isArray(target)) {
      return target.join(', ');
    }

    // CASO 2: Prisma intermedio: meta.target como string → 'usuarios_email_key'
    if (typeof target === 'string') {
      return this.parseConstraintName(target);
    }

    // CASO 3: Prisma 7 + driverAdapter: el constraint está en originalMessage
    //    Ej: "llave duplicada viola restricción de unicidad «usuarios_email_key»"
    const meta = exception.meta as Record<string, unknown> | undefined;
    const driverError = meta?.driverAdapterError as
      | { cause?: { originalMessage?: string } }
      | undefined;
    const originalMessage = driverError?.cause?.originalMessage;

    if (typeof originalMessage === 'string') {
      // Captura el nombre entre comillas «» (Postgres en español) o "" o ''
      const match = originalMessage.match(/[«"']([^«»"']+)[»"']/);
      if (match) {
        return this.parseConstraintName(match[1]);
      }
    }

    // 4. Último recurso: usar el modelName
    const modelName = meta?.modelName;
    if (typeof modelName === 'string') {
      return `campo único de ${modelName}`;
    }

    return 'campo único';
  }

  private parseConstraintName(constraint: string): string {
    // Patrón típico de Postgres: <tabla>_<campo>_key → captura <campo>
    // Ej: 'usuarios_email_key' → 'email'
    const match = constraint.match(/_([a-zA-Z0-9]+)_key$/);
    return match ? match[1] : constraint;
  }
}