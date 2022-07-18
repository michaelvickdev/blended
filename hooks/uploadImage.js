import { storage } from '../config';
import { ref, uploadBytes } from 'firebase/storage';

export const uploadImage = async (uri, imageName) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `images/dp/${imageName}`);

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, blob).then(() => {
    console.log('Uploaded a blob or file!');
  });
};
