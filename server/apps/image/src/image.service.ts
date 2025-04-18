import { Injectable } from '@nestjs/common';
import { ImageResponse, UploadRequest, UploadResponse } from '../../../libs/protos/image';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { startImageWorker } from './image.processor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import * as sharp from 'sharp';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class ImageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(
    private config: ConfigService,
    @InjectQueue('image-processing') private imageQueue: Queue,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    this.endpoint = this.config.get<string>('S3_ENDPOINT')!;
    this.bucket = this.config.get<string>('S3_BUCKET')!;

    this.s3 = new S3Client({
      region: this.config.get<string>('S3_REGION'),
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!,
      },
      forcePathStyle: true,
    });
  }

  onModuleInit() {
    startImageWorker();
  }

  async upload(data: UploadRequest): Promise<UploadResponse> {
    try {
      const id = uuidv4();
      const key = `${data.userId}/${id}-${data.filename}`;
      const buffer = Buffer.from(data.chunk);

      const metadata = await sharp(buffer).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      const size = `${width}x${height}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: Buffer.from(data.chunk),
          ContentType: data.mimetype,
        }),
      );

      await this.imageQueue.add('process', {
        id,
        key,
        userId: data.userId,
        mimetype: data.mimetype,
      });

      await this.imageRepository.save({
        id,
        originalName: data.filename,
        key,
        status: 'processing',
        size,
        userId: data.userId,
      });

      const url = `http://localhost:9000/${this.bucket}/${key}`;

      console.log(`✅ Загружено в S3: ${url}`);

      return {
        id,
        status: 'uploaded',
      };
    } catch (error) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  }

  async getLatestImage(userId: string): Promise<ImageResponse> {
    const image = await this.imageRepository.findOne({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    });

    if (!image) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'У пользователя нет изображений',
      });
    }

    return {
      id: image.id,
      status: image.status,
      name: image.originalName,
      uploadedAt: image.uploadedAt.toISOString(),
      size: image.size,
    };
  }

  async getLatestProcessedImageUrl(
    userId: string,
  ): Promise<string | undefined> {
    const image = await this.imageRepository.findOne({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    });

    if (!image) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'У пользователя нет изображений',
      });
    }

    return image.processedKey
      ? `http://localhost:9000/${this.bucket}/${image.processedKey}`
      : undefined;
  }
}
