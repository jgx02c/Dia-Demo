import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#2f3136]">
      <main className="h-screen">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 