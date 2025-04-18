import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isAxios401(error)) {
        handleUnauthorized();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isAxios401(error)) {
        handleUnauthorized();
      }
    },
  }),
});

function isAxios401(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as any).response?.status === 401
  );
}

function handleUnauthorized() {
  toast.error('Сессия истекла. Пожалуйста, войдите снова.');
  localStorage.removeItem('access_token');
  window.location.href = '/auth?tab=login';
}
