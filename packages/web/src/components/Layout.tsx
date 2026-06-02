import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6 max-w-4xl pb-safe">{children}</main>
    </div>
  );
}
