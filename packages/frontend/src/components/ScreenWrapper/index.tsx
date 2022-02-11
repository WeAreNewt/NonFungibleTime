import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { RiskSeverity } from '../../types';

interface ScreenWrapperProps {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  const { trmRisk } = useAppDataProvider();
  if (trmRisk === RiskSeverity.SEVERE) {
    return (
      <div className="bg-slate-100 dark:bg-black w-full h-full">
        <div className="text-white font-semibold p-5 pt-20 text-center">Your wallet has been blocked from accessing this application</div>
      </div>
    );
  } else {
    return (
      <div className="bg-slate-100 dark:bg-black flex flex-col">
        <div className="min-h-screen grow">
          <Navbar />
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}
