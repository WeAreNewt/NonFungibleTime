import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer/index';

interface ScreenWrapperProps {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <div className="relative h-full bg-slate-100 dark:bg-black flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
