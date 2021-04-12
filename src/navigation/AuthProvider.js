import React, {useState, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import {Text, View, ToastAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
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
        googleLogin: async () => {
          try {
            const {idToken} = await GoogleSignin.signIn();

            const googleCredential = auth.GoogleAuthProvider.credential(
              idToken,
            );
            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              // Use it only when user Sign's up,

              .then(() => {
                //console.log('current User', auth().currentUser);
                firestore()
                  .collection('Users')
                  .doc(auth().currentUser.email)
                  .set({
                    DateOfBirthf: '',
                    Scheduledate: '',
                    Scheduletime: '',
                    emailid: auth().currentUser.email,
                    imageurl: null,
                    phonenuber: '',
                    device_token: device_id,
                    is_online: 'true',
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                  })
                  .catch((error) => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })

              .catch((error) => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
          }
        },
        fbLogin: async () => {
          try {
            const result = await LoginManager.logInWithPermissions([
              'public_profile',
              'email',
            ]);

            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
              throw 'Something went wrong obtaining access token';
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(
              data.accessToken,
            );
            await auth()
              .signInWithCredential(facebookCredential)

              .then(() => {
                console.log('current User', auth().currentUser);
                firestore()
                  .collection('Users')
                  .doc(auth().currentUser.email)
                  .set({
                    DateOfBirthf: '',
                    Scheduledate: '',
                    Scheduletime: '',
                    emailid: auth().currentUser.email,
                    imageurl: null,
                    phonenuber: '',
                    device_token: device_id,
                    is_online: 'true',
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                  })

                  .catch((error) => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })

              .catch((error) => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
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
