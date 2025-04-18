import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
import { ServiceError, status } from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((err: ServiceError) => {
        if (err?.code !== undefined) {
          let httpStatus = 500;

          switch (err.code) {
            case status.NOT_FOUND:
              httpStatus = 404;
              break;
            case status.INVALID_ARGUMENT:
              httpStatus = 400;
              break;
            case status.UNAUTHENTICATED:
              httpStatus = 401;
              break;
            case status.PERMISSION_DENIED:
              httpStatus = 403;
              break;
            case status.ALREADY_EXISTS:
              httpStatus = 409;
              break;
            case status.UNAVAILABLE:
              httpStatus = 503;
              break;
          }

          const cleanMessage =
            err.message?.replace(/^\d+\s[\w_]+:\s*/, '') ?? 'gRPC Error';

          return throwError(() => new HttpException(cleanMessage, httpStatus));
        }

        return throwError(() => err);
      }),
    );
  }
}
