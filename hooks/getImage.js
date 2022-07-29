import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../config';

export const getImage = async (url) => {
  try {
    const image = await getDownloadURL(ref(storage, 'images/' + url));
    return { uri: image.toString() };
  } catch {
    return require('../assets/default-post.jpg');
  }
};
