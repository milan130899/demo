import React, {useState, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import {Text, View, ToastAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const device_id = DeviceInfo.getUniqueId();
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            const login = await auth().signInWithEmailAndPassword(
              email,
              password,
            );
            await firestore()
              .collection('Users')
              .doc(login.user.email)
              .update({device_token: device_id});
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
                    device_token: device_id,
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
