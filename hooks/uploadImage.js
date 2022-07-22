import { storage } from '../config';
import { ref, uploadBytesResumable } from 'firebase/storage';

export const uploadImage = async (uri, imageName) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `images/${imageName}`);

  // 'file' comes from the Blob or File API
  await uploadBytesResumable(storageRef, blob);
};
