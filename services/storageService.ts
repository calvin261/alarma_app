import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (fileUri: string, fileName: string, onProgress?: (progress: number) => void): Promise<string> => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `uploads/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};
// ...existing code from storageService.js migrado a TS...
