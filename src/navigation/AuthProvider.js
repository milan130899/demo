import React, {useState, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import {Text, View, ToastAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [device, setDevice] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
            firestore()
              .collection('Users')
              .doc(email)
              .update({device_token: DeviceInfo.getUniqueId()});
            //.get()
            //.then((documentSnapshot) => {
            //   setDevice(documentSnapshot.data());
            //   const data_device = documentSnapshot.data();

            //   if (data_device.is_online == 'true') {
            //     alert('no login allow');
            //   } else {
            //     auth().signInWithEmailAndPassword(email, password);
            //   }
            // });
          } catch (e) {
            //console.log(e);
            ToastAndroid.show(
              'Email or Password is Incorrect',
              ToastAndroid.SHORT,
            );
          }
        },
        register: async (email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                firestore()
                  .collection('Users')
                  .doc(auth().currentUser.email)
                  .set({
                    DateOfBirthf: '',
                    Scheduledate: '',
                    Scheduletime: '',
                    emailid: email,
                    imageurl: null,
                    phonenuber: '',
                    device_token: DeviceInfo.getUniqueId(),
                    is_online: 'true',
                  })
                  .catch((error) => {
                    console.log('something went Wrong', error);
                  });
              })
              .catch((error) => {
                console.log('something went Wrong', error);
              });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            // firestore()
            //   .collection('Users')
            //   .doc(auth().currentUser.email)
            //   .update({is_online: 'false'});
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
