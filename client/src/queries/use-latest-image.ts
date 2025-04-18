import { Query, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios.ts';

export interface LatestImage {
  id: string;
  name: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  size: string;
  uploadedAt: string;
}

export const useLatestImage = () => {
  return useQuery<LatestImage>({
    queryKey: ['latest-image'],
    queryFn: async () => {
      const res = await api.get('/image/latest');
      return res.data;
    },
    refetchInterval: (q: Query<LatestImage>) => {
      const data = q.state.data;
      if (!data) return false;
      return data.status === 'processing' ? 2000 : false;
    },
  });
};