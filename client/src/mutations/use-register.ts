import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RegisterData {
  email: string;
  password: string;
}

export const useRegister = (onError: (err: string) => void) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await axios.post('http://localhost:3000/auth/signup', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Регистрация прошла успешно!');
      navigate('/auth?tab=login');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      onError(message)
      toast.error(message);
    },
  });
};