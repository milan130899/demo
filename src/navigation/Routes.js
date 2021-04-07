import {NavigationContainer} from '@react-navigation/native';
import React, {useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from './AuthProvider';
import DeviceInfo from 'react-native-device-info';
import firebase from '@react-native-firebase/app';
const Routes = () => {
  const {user, setUser, logout} = useContext(AuthContext);
  const [inisiallizing, setInisiallizing] = useState(true);
  const device_id = DeviceInfo.getUniqueId();

  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (user) {
      // await firestore()
      //   .collection('Users')
      //   .doc(user.email)
      //   .update({is_online: 'true'});

      await firestore()
        .collection('Users')
        .doc(user.email)
        .onSnapshot((documentSnapshot) => {
          const data_device = documentSnapshot.data();

          if (device_id != data_device.device_token) {
            alert('you are signned in other device');
            logout();
          }
        });
      // .then((documentSnapshot) => {
      //   const data_device = documentSnapshot.data();

      //   if (device_id != data_device.device_token) {
      //     alert('you are signned in other device');
      //     logout();
      //   }
      // });
    }
    if (inisiallizing) setInisiallizing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // firebase.initializeApp(firebaseConfig);
  // firebase.initializeApp({
  //   apiKey: 'AIzaSyCvXwk7rI0pVN63jYvn_eGz1dKspobkh1o',
  //   authDomain: 'loginsignup-96e30.firebaseapp.com',
  //   projectId: 'loginsignup-96e30',
  //   storageBucket: 'loginsignup-96e30.appspot.com',
  //   messagingSenderId: '220473869342',
  //   appId: '1:220473869342:web:21b9ddfc86032b1c0e1a0f',
  //   measurementId: 'G-9T5HJVKHTC',
  // });
  if (inisiallizing) return null;
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
