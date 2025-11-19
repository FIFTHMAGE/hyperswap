import React from 'react';

interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  sidebar,
  main,
  sidebarPosition = 'left',
}) => {
  return (
    <div className="flex gap-6">
      {sidebarPosition === 'left' && <aside className="w-64 flex-shrink-0">{sidebar}</aside>}
      <div className="flex-1">{main}</div>
      {sidebarPosition === 'right' && <aside className="w-64 flex-shrink-0">{sidebar}</aside>}
    </div>
  );
};
