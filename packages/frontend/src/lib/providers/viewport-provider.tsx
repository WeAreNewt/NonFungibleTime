import React, { useContext, useEffect } from 'react';

export interface ViewportType {
  width: number;
  height: number;
}

const ViewportContext = React.createContext<ViewportType>({} as ViewportType);

export const ViewportProvider: React.FC = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return <ViewportContext.Provider value={{ width, height }}>{children}</ViewportContext.Provider>;
};

export const useViewportProvider = () => useContext(ViewportContext);
