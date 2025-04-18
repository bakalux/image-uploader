import { Job, Worker } from 'bullmq';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as sharp from 'sharp';
import { Readable } from 'stream';
import { DataSource, Repository } from 'typeorm';
import { Image } from './image.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/image-upload/.env' });

export async function startImageWorker() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Image],
    synchronize: false,
  });

  await dataSource.initialize();
  const imageRepo: Repository<Image> = dataSource.getRepository(Image);

  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  const bucket = process.env.S3_BUCKET;

  new Worker(
    'image-processing',
    async (job: Job<{ key: string; id: string; userId: string }>) => {
      try {
        const { key, id, userId } = job.data;

        console.log('🔧 Обрабатываем:', key);

        const input = await s3.send(
          new GetObjectCommand({
            Bucket: bucket,
            Key: key,
          }),
        );

        const inputBuffer = await streamToBuffer(input.Body as Readable);

        const processedBuffer = await sharp(inputBuffer)
          .webp({ quality: 80 })
          .toBuffer();
        const processedKey = `${userId}/${id}-processed.webp`;

        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: processedKey,
            Body: processedBuffer,
            ContentType: 'image/webp',
          }),
        );

        await imageRepo.update(id, {
          status: 'processed',
          processedKey,
        });

        console.log('✅ Обработка завершена:', processedKey);
      } catch (error) {
        await imageRepo.update(job.data.id, {
          status: 'failed',
        });
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    },
  );
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
