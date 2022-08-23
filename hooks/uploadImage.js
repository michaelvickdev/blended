import { storage } from '../config';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { manipulateAsync } from 'expo-image-manipulator';

export const uploadImage = async (uri, imageName, isVideo = false) => {
  if (!isVideo) {
    const compressed = await manipulateAsync(uri, [], { compress: 0.4 });
    uri = compressed.uri;
  }
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `images/${imageName}`);

  await uploadBytesResumable(storageRef, blob);
};
