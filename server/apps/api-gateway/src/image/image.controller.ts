import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { lastValueFrom, Observable } from 'rxjs';
import {
  ImageResponse,
  ProcessedImageResponse,
  UploadRequest,
  UploadResponse,
  UserRequest,
} from '../../../../libs/protos/image';
import { ClientGrpc } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Express } from 'express';
import { AuthRequest } from './types';

interface ImageServiceGrpc {
  Upload(request: UploadRequest): Observable<UploadResponse>;

  GetLatestImage(request: UserRequest): Observable<ImageResponse>;

  GetLatestProcessedImage(
    request: UserRequest,
  ): Observable<ProcessedImageResponse>;
}

@Controller('image')
@UseGuards(AuthGuard)
export class ImageController {
  private imageService: ImageServiceGrpc;

  constructor(@Inject('IMAGE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.imageService =
      this.client.getService<ImageServiceGrpc>('ImageService');
  }

  @Get('latest')
  getLatest(@Req() req: AuthRequest) {
    return this.imageService.GetLatestImage({
      userId: req.userId!,
    });
  }

  @Get('latest-processed')
  getImageProcessed(@Req() req: AuthRequest) {
    return this.imageService.GetLatestProcessedImage({
      userId: req.userId!,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    const userId: string | null = req.userId;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { buffer, originalname, mimetype } = file;

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    const response = await lastValueFrom(
      this.imageService.Upload({
        chunk: buffer,
        filename: originalname,
        mimetype: mimetype,
        userId,
      }),
    );

    return {
      message: 'Загружено',
      id: response.id,
      status: response.status,
    };
  }
}
