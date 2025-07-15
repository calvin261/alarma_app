import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const addIncident = async (data: {
  imageUrl: string;
  date: Date;
  location?: string;
}) => {
  return await addDoc(collection(db, 'incidents'), {
    imageUrl: data.imageUrl,
    date: Timestamp.fromDate(data.date),
    location: data.location || '',
  });
};
// ...existing code from firestoreService.js migrado a TS...
