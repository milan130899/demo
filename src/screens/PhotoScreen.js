import React, {useContext} from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import FormButton from '../components/FormButton';
import Fonts from '../common/Fonts';
import {AuthContext} from '../navigation/AuthProvider';
import storage from '@react-native-firebase/storage';
import DeviveInfo from 'react-native-device-info';
import Header from '../components/Header';
import {windowHeight, windowWidth} from '../utils/Dimentions';
const font = Fonts.vanbergRegular;
const token = DeviveInfo.getUniqueId();

const PhotoScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);

  const [filePath, setFilePath] = useState({});
  const [imageVisible, SetImageVisible] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState();
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App Needs Camera Permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        //console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        // console.log('base64 -> ', response.base64);
        // console.log('uri -> ', response.uri);
        // console.log('width -> ', response.width);
        // console.log('height -> ', response.height);
        // console.log('fileSize -> ', response.fileSize);
        // console.log('type -> ', response.type);
        // console.log('fileName -> ', response.fileName);
        setFilePath(response);
        const uri = response.uri;
        setImageUri(uri);
        //console.log(imageUri);
        SetImageVisible(false);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      setFilePath(response);
      const uri = response.uri;
      setImageUri(uri);
      //console.log(imageUri);
      SetImageVisible(false);
    });
  };
  /**********Photo Upload in Google FireStore**********************/
  const submitPhoto = async () => {
    if (imageUri == null) {
      return null;
    }
    const uploadUri = imageUri;
    var parts = uploadUri.split('/');
    let fileName = parts[parts.length - 1];

    setUploading(true);
    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(uploadUri);
    try {
      //await storage().ref(fileName).putFile(uploadUri);
      await task;
      setUploading(false);
      const url = await storageRef.getDownloadURL();
      Alert.alert(
        'Image Uploaded',
        'Your Image has been uploaded Successfully!!',
      );
      console.log('Firestore image URL:', url);
      return url;
    } catch (e) {
      console.log(e);
    }
  };
  /**********Photo Upload in Google FireStore**********************/
  return (
    <>
      <View>
        <Header
          headerTitle="Photo"
          iconType="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>

      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 20,
            fontFamily: font,
          }}>
          Photo Screen
        </Text>
        {imageVisible ? (
          <Image
            source={require('../img/test.jpeg')}
            style={styles.imageStyle}
          />
        ) : (
          <Image source={{uri: filePath.uri}} style={styles.imageStyle} />
        )}

        <FormButton
          buttonTitle="Camera"
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}
        />
        <FormButton
          buttonTitle="Gallery"
          activeOpacity={0.5}
          // style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}
        />
        <FormButton
          buttonTitle="Upload"
          activeOpacity={0.5}
          // style={styles.buttonStyle}
          onPress={() => submitPhoto()}
        />
        <FormButton buttonTitle="Logout" onPress={() => logout()} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: windowWidth / 1,
    height: windowHeight / 1,
  },
  titleText: {
    fontSize: 29,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#80674e',
    height: 40,
    justifyContent: 'center',
    width: 150,
    borderRadius: 17,
    marginTop: 20,
  },
  imageStyle: {
    width: windowWidth / 1.5,
    height: windowHeight / 4,
    margin: 5,
  },
});

export default PhotoScreen;
