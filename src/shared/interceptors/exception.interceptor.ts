import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Internal Server Error';

    this.logger.error(message, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
