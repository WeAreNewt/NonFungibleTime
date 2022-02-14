import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface ScreenWrapperProps {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <div className="bg-slate-100 dark:bg-black flex flex-col">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}
