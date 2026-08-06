import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class CatalogExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatalogExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const code = (exception as any).code;

    // Check for MySQL Duplicate Entry (Error 1062)
    if (
      code === 'ER_DUP_ENTRY' ||
      exception.message.includes('Duplicate entry')
    ) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message:
          'Data katalog (slug, SKU, atau nama) sudah digunakan dan harus unik.',
        error: 'Conflict',
      });
    }

    this.logger.error(exception.message, exception.stack);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan internal pada database katalog.',
      error: 'Internal Server Error',
    });
  }
}
