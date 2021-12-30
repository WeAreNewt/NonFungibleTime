import React, { ReactNode } from 'react'
import Menu from '../Menu'

interface ScreenWrapperProps {
    children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
    return (
        <div>
            <Menu />
            {children}
        </div>
    )
}
