import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BpmResponse } from 'src/main/index';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res = new BpmResponse(false, 
      {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      }
      , [exception.message])
    response.status(status).json(res);
  }
}