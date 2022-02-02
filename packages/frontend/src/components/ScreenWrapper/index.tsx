import React, { ReactNode } from 'react'
import Navbar from '../Navbar'

interface ScreenWrapperProps {
    children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
    return (
        <div className="relative h-screen overflow-hidden bg-white dark:bg-black">
            <Navbar />
            {children}
        </div>
    )
}
