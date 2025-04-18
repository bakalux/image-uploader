import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

export const createImageQueue = (config: ConfigService) => {
  return new Queue('image-processing', {
    connection: {
      host: config.get('REDIS_HOST') || 'localhost',
      port: config.get('REDIS_PORT') || 6379,
    },
  });
};
