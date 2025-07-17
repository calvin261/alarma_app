// Contexto global para escuchar señales de Firebase y reproducir sonido en toda la app
import React, { createContext, useContext, useEffect } from 'react';
import { initSignalListener, cleanupSignalListener } from './signalListenerSingleton';
import { setSignalListenerPlayer } from './signalListenerSingleton';
import { useAudioPlayer } from 'expo-audio';

interface SignalListenerContextProps {
  // Puedes agregar aquí estados globales si lo necesitas
}

// Contexto para compartir el listener global
const SignalListenerContext = createContext<SignalListenerContextProps>({});

export const useSignalListenerContext = () => useContext(SignalListenerContext);

export const SignalListenerProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  // Inicializa el player con el hook
  const audioSource = require('../assets/sound/sound.mp3');
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    initSignalListener(userId);
    // Pasa el player al singleton para gestionar el listener
    const cleanup = setSignalListenerPlayer(player);
    return () => {
      if (cleanup) cleanup();
      cleanupSignalListener();
    };
  }, [userId, player]);

  return (
    <SignalListenerContext.Provider value={{}}>
      {children}
    </SignalListenerContext.Provider>
  );
};
