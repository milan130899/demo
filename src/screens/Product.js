import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Button,
  Pressable,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Header from '../components/Header';
import FormButton from '../components/FormButton';
import Fonts from '../common/Fonts';
import {windowHeight, windowWidth} from '../utils/Dimentions';

const Product = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  /*************************Image Select********************************/
  const [imageVisible, SetImageVisible] = useState(true);
  var [imageUri, setImageUri] = useState();
  const [filePath, setFilePath] = useState({});

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
        setFilePath(response);
        const uri = response.uri;
        //console.log('We got uri', uri);
        setImageUri(uri);
        SetImageVisible(false);
        setModalVisible(!modalVisible); // Hiding Modal After I got Image
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
      setFilePath(response);
      const uri = response.uri;
      //console.log('We got uri', uri);
      setImageUri(uri);
      SetImageVisible(false);
      setModalVisible(!modalVisible); // Hiding Modal After I got Image
    });
  };
  /********************Image Select*******************************/

  /****************Add Product To Database**********************************/

  const handleAddProduct = async () => {
    let imgUrl = await submitPhoto();
    if (imgUrl == null && userData.imageurl) {
      imgUrl = userData.imageurl;
    }
    firestore()
      .collection('Products')
      .doc()
      .set({
        Title: productTitle,
        ImageUrl: imgUrl,
        Description: productDescription,
        user_id: user.uid,
      })
      .catch((error) => {
        console.log('something went Wrong', error);
      })
      .then(() => {
        console.log('Product Added!!');
        Alert.alert('Product Added!!', 'Your Product has been Added!!');
      })
      .then(() => navigation.navigate('Home'));
  };

  const submitPhoto = async () => {
    if (imageUri == null) {
      return null;
    }
    const uploadUri = imageUri;
    var parts = uploadUri.split('/');
    let fileName = parts[parts.length - 1];

    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(uploadUri);
    try {
      //await storage().ref(fileName).putFile(uploadUri);
      await task;
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  /****************Add Product To Database**********************************/

  return (
    <>
      <View>
        <Header
          headerTitle="Add Product"
          iconType="menu"
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.inner}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Choose Photo</Text>
                  <Pressable
                    style={styles.camerabutton}
                    onPress={() => captureImage('photo')}>
                    <Text style={styles.textStyle}>Camera</Text>
                  </Pressable>
                  <Pressable
                    style={styles.camerabutton}
                    onPress={() => chooseFile('photo')}>
                    <Text style={styles.textStyle}>Gallery</Text>
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {imageVisible ? (
                <Image
                  source={require('../img/product.png')}
                  style={styles.productLogo}
                />
              ) : (
                <Image source={{uri: imageUri}} style={styles.productLogo} />
              )}

              {/* {imageUri ? (
                <Image source={{uri: imageUri}} style={styles.profileLogo} />
              ) : userData ? (
                <Image
                  source={{uri: userData.imageurl}}
                  style={styles.profileLogo}
                />
              ) : (
                <Image
                  source={require('../img/profile.png')}
                  style={styles.profileLogo}
                />
              )} */}
            </TouchableOpacity>
            <Text style={styles.text}>Add Product</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.titleText}>Title :</Text>
              <View style={styles.titleContainer}>
                <TextInput
                  value={productTitle}
                  placeholder="Enter Title"
                  onChangeText={(text) => setProductTitle(text)}
                  style={styles.titleTextInput}
                />
              </View>
              <Text style={styles.descText}>Description :</Text>
              <View style={styles.descContainer}>
                <TextInput
                  value={productDescription}
                  placeholder="Enter Description"
                  multiline
                  onChangeText={(text) => setProductDescription(text)}
                  style={styles.descTextInput}
                />
              </View>
              <View style={styles.formButton}>
                <FormButton buttonTitle="Submit" onPress={handleAddProduct} />
              </View>
            </View>

            {/* <Text>{user.uid}</Text> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productLogo: {
    height: 120,
    width: 120,
    resizeMode: 'cover',
    position: 'relative',
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 2,
  },
  inner: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: windowWidth / 1,
    height: windowHeight / 1,
  },
  text: {
    fontFamily: Fonts.russeldexter,
    fontSize: 38,
    marginVertical: 15,
    color: '#051d5f',
  },
  fieldContainer: {
    //backgroundColor : '#000',
    width: windowWidth / 1.2,
    height: windowHeight / 2.5,
  },
  /**********Title Input Style**********************/
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  titleText: {
    fontFamily: Fonts.russeldexter,
    fontSize: 25,
    marginTop: 10,
    color: '#000',
  },
  titleTextInput: {
    // borderColor: '#000',
    // borderWidth: 2,
    fontSize: 20,
    fontFamily: 'serif',
    width: windowWidth / 1.2,
  },
  /************Description Style*******************************/
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  descText: {
    fontFamily: Fonts.russeldexter,
    fontSize: 25,
    marginTop: 10,
    color: '#000',
  },
  descTextInput: {
    // borderColor: '#000',
    // borderWidth: 2,
    fontSize: 20,
    fontFamily: 'serif',
    width: windowWidth / 1.2,
  },
  /*************Modal Style******************************************/
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'gray',
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 28,
    elevation: 2,
    marginVertical: 5,
    backgroundColor: '#003E66',
  },
  camerabutton: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 25,
    elevation: 2,
    backgroundColor: '#7BB6EA',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 25,
    fontFamily: Fonts.romanus,
    textAlign: 'center',
  },

  formButton: {
    alignItems: 'center',
    marginTop: 8,
  },
});

export default Product;
