// Singleton para el listener global de Firebase y el audio player
import database from '@react-native-firebase/database';
import { useAudioPlayer } from 'expo-audio';

let initialized = false;
let reference: any = null;

export function initSignalListener(userId: string) {
  if (initialized) return;
  initialized = true;
  reference = database().ref(`/signals/${userId}`);
}

export function setSignalListenerPlayer(player: any) {
  if (!reference || !player) return;
  const onValueChange = (snapshot: any) => {
    console.log('snapshot.val()', snapshot.val());
    player.seekTo(0);
    if (snapshot.val()?.trigger) {
      player.play();
    } else {
      player.pause();
    }
  };
  reference.on('value', onValueChange);
  return () => reference.off('value', onValueChange);
}

export function cleanupSignalListener() {
  reference = null;
  initialized = false;
}

