import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ImageResponse,
  ProcessedImageResponse,
  UploadRequest,
  UploadResponse,
  UserRequest,
} from '../../../libs/protos/image';
import { ImageService } from './image.service';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @GrpcMethod('ImageService', 'Upload')
  async upload(data: UploadRequest): Promise<UploadResponse> {
    return this.imageService.upload(data);
  }

  @GrpcMethod('ImageService', 'GetLatestImage')
  async getLatestImage(data: UserRequest): Promise<ImageResponse> {
    return this.imageService.getLatestImage(data.userId);
  }

  @GrpcMethod('ImageService', 'GetLatestProcessedImage')
  async getLatestProcessedImage(
    data: UserRequest,
  ): Promise<ProcessedImageResponse> {
    const url = await this.imageService.getLatestProcessedImageUrl(data.userId);

    return { url };
  }
}
