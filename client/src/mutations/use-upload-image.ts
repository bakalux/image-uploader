import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { getAccessToken } from '@/lib/token';

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const accessToken = getAccessToken();

      const res = await axios.post('/image/upload', formData, {
        baseURL: 'http://localhost:3000',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onMutate: () => {
      queryClient.removeQueries({ queryKey: ['latest'] });
      queryClient.removeQueries({ queryKey: ['latest-processed'] });
    },
    onSuccess: () => {
      toast.success('Изображение успешно загружено');

      queryClient.invalidateQueries({ queryKey: ['latest-image'] });
      queryClient.invalidateQueries({ queryKey: ['latest-processed-url'] });
    },
    onError: () => {
      toast.error('Ошибка загрузки изображения');
    },
  });
}