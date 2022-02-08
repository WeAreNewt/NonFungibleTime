import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface ScreenWrapperProps {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <div className="relative h-full bg-slate-100 dark:bg-black">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
