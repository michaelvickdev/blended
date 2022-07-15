import { firebase } from '../config';

export default function onRegisterPress({ navigation, data }) {
  console.log(data);
  // firebase
  //     .auth()
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((response) => {
  //         const uid = response.user.uid
  //         const data = {
  //             id: uid,
  //             email,
  //             fullName,
  //         };
  //         const usersRef = firebase.firestore().collection('users')
  //         usersRef
  //             .doc(uid)
  //             .set(data)
  //             .then(() => {
  //                 navigation.navigate('Home', {user: data})
  //             })
  //             .catch((error) => {
  //                 alert(error)
  //             });
  //     })
  //     .catch((error) => {
  //         alert(error)
  // });
}
