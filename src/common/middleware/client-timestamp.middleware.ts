import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClientTimestampMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestampHeader = req.headers['x-client-timestamp'] as string;

    if (!timestampHeader) {
      throw new BadRequestException('Missing required header: x-client-timestamp');
    }

    const parsedDate = new Date(timestampHeader);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid format for x-client-timestamp. Expected a valid ISO string.');
    }

    req.clientTime = parsedDate;
    next();
  }
}