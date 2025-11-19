import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, header, footer }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {header && <header className="sticky top-0 z-50 bg-white border-b">{header}</header>}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      {footer && <footer className="bg-gray-100 border-t">{footer}</footer>}
    </div>
  );
};
