import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  setDoc 
} from 'firebase/firestore';
import { db } from './firebase';

export const createProject = async (userId, projectData) => {
  const project = {
    ...projectData,
    ownerId: userId,
    createdAt: serverTimestamp(),
    tasks: []
  };
  
  return await addDoc(collection(db, "projects"), project);
};

export const updateProject = async (projectId, updates) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, updates);
};

export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
};

export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  });
};
