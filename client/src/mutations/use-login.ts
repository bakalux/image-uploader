import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  email: string;
  password: string;
}

export function useLogin(setApiError: (message: string | null) => void) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await axios.post('http://localhost:3000/auth/signin', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Вы успешно вошли');
      localStorage.setItem('access_token', data.token);
      navigate('/');
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Произошла ошибка';
        setApiError(Array.isArray(message) ? message[0] : message);
      } else {
        setApiError('Что-то пошло не так');
      }
    },
  });
}
