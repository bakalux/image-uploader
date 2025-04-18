import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios.ts';

export const useLatestProcessedImageUrl = (enabled: boolean) => {
  return useQuery<{ url: string }>({
    queryKey: ['latest-processed-url'],
    queryFn: async () => {
      const res = await api.get('/image/latest-processed');
      return res.data;
    },
    enabled,
  });
};
