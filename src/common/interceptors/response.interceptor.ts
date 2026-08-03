import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorator/response-message.decorator';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T> | StreamableFile>
{
  // Inject Reflector to read metadata from methods
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | StreamableFile> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const handler = context.getHandler();

    // 1. Try to read a custom message from the @ResponseMessage() decorator
    let message = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, handler);

    // 2. Fallback: If no custom message is set, use clean standard defaults based on HTTP method
    if (!message) {
      const method = request.method;
      if (method === 'POST') message = 'Resource created successfully';
      else if (method === 'PATCH' || method === 'PUT')
        message = 'Resource updated successfully';
      else if (method === 'DELETE') message = 'Resource deleted successfully';
      else message = 'Operation completed successfully';
    }

    return next.handle().pipe(
      map((data) => {
        // 3. Pass StreamableFile directly through without wrapping
        if (data instanceof StreamableFile) {
          return data;
        }

        // 4. Wrap normal JSON responses
        return {
          success: true,
          message,
          data: data ?? null,
        };
      }),
    );
  }
}