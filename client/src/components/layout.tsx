import { ReactNode } from 'react';
import { Header } from '@/components/header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
    </div>
  );
};
