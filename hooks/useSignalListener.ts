import { useEffect } from 'react';
import database from '@react-native-firebase/database';

import { useAudioPlayer } from 'expo-audio';

// Custom hook to listen for a signal and play a sound
export function useSignalListener(myId: string) {
    const reference = database().ref(`/signals/${myId}`);

    const audioSource = require('../assets/sound/sound.mp3');
    const player = useAudioPlayer(audioSource);

    useEffect(() => {
        reference.on('value', snapshot => {
            player.seekTo(0); // Reset the player to the start
            console.log(`Signal received for ${myId}:`, snapshot.val(), audioSource);
            console.log(snapshot.val()?.trigger);
            if (snapshot.val()?.trigger) {
                player.play();
            } else {
                player.pause();
            }
        });

        return () => reference.off('value');
    }, [myId]);
}
