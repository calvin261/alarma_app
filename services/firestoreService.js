import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export const getIncidents = async (filters = {}) => {
  let q = collection(db, 'incidents');
  let constraints = [];
  if (filters.category) constraints.push(where('category', '==', filters.category));
  if (filters.startDate) constraints.push(where('date', '>=', filters.startDate));
  if (filters.endDate) constraints.push(where('date', '<=', filters.endDate));
  constraints.push(orderBy('date', 'desc'));
  const finalQuery = query(q, ...constraints);
  const snapshot = await getDocs(finalQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 