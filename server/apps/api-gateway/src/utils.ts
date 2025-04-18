import { status } from '@grpc/grpc-js';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

interface GrpcError {
  code: status;
  message: string;
  details?: string;
}

/**
 * Универсальный обработчик gRPC ошибок
 * @param observable$ Observable из gRPC запроса
 * @param customErrorHandler Опциональный кастомный обработчик ошибок
 * @returns Observable с преобразованными ошибками
 */
export function handleGrpcError<T>(
  observable$: Observable<T>,
  customErrorHandler?: (error: GrpcError) => HttpException,
): Observable<T> {
  return observable$.pipe(
    catchError((error: GrpcError) => {
      console.error('gRPC Error:', {
        code: error.code,
        message: error.message,
        details: error.details,
      });

      if (customErrorHandler) {
        throw customErrorHandler(error);
      }

      throw mapGrpcErrorToHttp(error);
    }),
  );
}

/**
 * Маппит gRPC ошибки в HTTP исключения
 */
function mapGrpcErrorToHttp(error: GrpcError): HttpException {
  switch (error.code) {
    case status.INVALID_ARGUMENT:
      return new BadRequestException({
        message: error.details,
      });
    case status.NOT_FOUND:
      return new NotFoundException(error.details);
    case status.ALREADY_EXISTS:
      return new ConflictException(error.details);
    case status.PERMISSION_DENIED:
    case status.UNAUTHENTICATED:
      return new UnauthorizedException(error.details);
    case status.RESOURCE_EXHAUSTED:
      return new BadRequestException('Quota exceeded');
    case status.FAILED_PRECONDITION:
      return new BadRequestException(error.details);
    case status.ABORTED:
      return new ConflictException('Operation conflicted');
    case status.OUT_OF_RANGE:
      return new BadRequestException('Value out of range');
    case status.UNIMPLEMENTED:
      return new InternalServerErrorException('Feature not implemented');
    case status.UNAVAILABLE:
      return new InternalServerErrorException('Service unavailable');
    case status.DATA_LOSS:
      return new InternalServerErrorException('Data loss occurred');
    default:
      return new InternalServerErrorException(
        error.details || 'Internal server error',
      );
  }
}
