import React, { createContext, useContext, useState } from 'react';

interface CameraProviderProps {
  children: React.ReactNode;
}

const CameraContext = createContext<{ cameraIp: string | null; setCameraIp: React.Dispatch<React.SetStateAction<string | null>> } | undefined>(undefined);

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [cameraIp, setCameraIp] = useState<string | null>(null);
  return (
    <CameraContext.Provider value={{ cameraIp, setCameraIp }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error('useCamera debe usarse dentro de <CameraProvider>');
  return ctx;
};
