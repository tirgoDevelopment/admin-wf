import { HttpException, HttpStatus } from "@nestjs/common";
import { ResponseStauses } from "src/main/index";

export class InternalErrorException extends HttpException {
    constructor(message: string = ResponseStauses.InternalServerError, logMessage?: string) {
      super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }