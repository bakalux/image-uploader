import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAuthPage = pathname.startsWith('/auth');

  return (
    <header className="border-b px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-bold">Image Uploader</h1>
      {!isAuthPage && (
        <Button variant="outline" onClick={onLogout}>
          Выйти
        </Button>
      )}
    </header>
  );

  function onLogout() {
    localStorage.removeItem('access_token');
    navigate('/auth?tab=login');
  }
};
