// Contexto global para escuchar señales de Firebase y reproducir sonido en toda la app
import React, { createContext, useContext, useEffect } from 'react';
import database from '@react-native-firebase/database';
import { useAudioPlayer } from 'expo-audio';

interface SignalListenerContextProps {
  // Puedes agregar aquí estados globales si lo necesitas
}

// Contexto para compartir el listener global
const SignalListenerContext = createContext<SignalListenerContextProps>({});

export const useSignalListenerContext = () => useContext(SignalListenerContext);

export const SignalListenerProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  // Referencia a la señal en la base de datos de Firebase
  const reference = database().ref(`/signals/${userId}`);
  // Fuente de audio para reproducir cuando la señal se activa
  const audioSource = require('../assets/sound/sound.mp3');
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    // Listener global: escucha cambios en la señal y reproduce/pausa el sonido
    reference.on('value', snapshot => {
      player.seekTo(0);
      if (snapshot.val()?.trigger) {
        player.play();
      } else {
        player.pause();
      }
    });
    // Limpia el listener al desmontar
    return () => reference.off('value');
  }, [userId]);

  return (
    <SignalListenerContext.Provider value={{}}>
      {children}
    </SignalListenerContext.Provider>
  );
};
