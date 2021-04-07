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
  FlatList,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PhoneInput from 'react-native-phone-number-input';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Header from '../components/Header';
import ProductsCompo from '../components/ProductsCompo';
import FormButton from '../components/FormButton';
import Fonts from '../common/Fonts';
import {windowHeight, windowWidth} from '../utils/Dimentions';

const ProfileScreen = ({navigation}) => {
  const [userphoneNumber, setPhoneNumber] = useState('');
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  //***********************Modal Date Picker**********************************************/
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [userDateOfBirth, setUserDateOfBirth] = useState('12-02-2021');
  const [userTime, setUserTime] = useState('11:20');
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();

    convertDate(date);
  };
  const handleTimeConfirm = (time) => {
    hideTimePicker();

    convertTime(time);
  };
  function convertDate(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    //console.log('USer selected', [date.getFullYear(), mnth, day].join('-'));

    let finalDate = [day, mnth, date.getFullYear()].join('-');
    setUserData({...userData, DateOfBirthf: finalDate});
    //setUserDateOfBirth(finalDate);
  }
  function convertTime(str) {
    let date = new Date(str),
      hour = ('0' + date.getHours()).slice(-2),
      minute = ('0' + date.getMinutes()).slice(-2);
    //console.log('USer selected', [hour, minute].join(':'));
    let finalTime = [hour, minute].join(':');
    setUserData({...userData, Scheduletime: finalTime});
    //setUserTime(finalTime);
  }
  //**************Future date ***************************/
  const [userFutureDate, setUserFutureDate] = useState('12-02-2021');
  const [isFuturePickerVisible, setFuturePickerVisibility] = useState(false);

  const showFutureDatePicker = () => {
    setFuturePickerVisibility(true);
  };
  const hideFutureDatePicker = () => {
    setFuturePickerVisibility(false);
  };
  const handleFutureDateConfirm = (date) => {
    hideFutureDatePicker();

    convertFutureDate(date);
  };
  function convertFutureDate(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    //console.log('USer selected', [date.getFullYear(), mnth, day].join('-'));

    let finalDate = [day, mnth, date.getFullYear()].join('-');
    setUserData({...userData, Scheduledate: finalDate});
    //setUserFutureDate(finalDate);
  }
  //***********************Modal Date Picker**********************************************/

  //*************************Number Corrector********************************************************/
  // function numFormate(num) {
  //   const phNum = [num];
  //   const final = phNum.map((x) => x.dialCode + x.phoneNumber);

  //   //console.log('Phone:', final);
  //   setUserData({...userData, phonenuber: final});
  //   //setPhoneNumber(final);
  // }

  //*************************Number Corrector********************************************************/

  //*******************************Get Image*********************************************************/
  const [filePath, setFilePath] = useState({});
  const [imageVisible, SetImageVisible] = useState(true);
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
  //*******************************Get Image*********************************************************/
  /************************Update User*************************************/
  const getUser = async () => {
    const currentUser = await firestore()
      .collection('Users')
      .doc(user.email)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          //console.log('user Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleUpdate = async () => {
    let imgUrl = await submitPhoto();
    if (imgUrl == null && userData.imageurl) {
      imgUrl = userData.imageurl;
    }
    firestore()
      .collection('Users')
      .doc(user.email)
      .update({
        DateOfBirthf: userData.DateOfBirthf,
        Scheduledate: userData.Scheduledate,
        Scheduletime: userData.Scheduletime,
        imageurl: imgUrl,
        phonenuber: userData.phonenuber,
      })
      .then(() => {
        console.log('User updated!!');
        Alert.alert('Profile Updated!!', 'Your Profile has been Upadated!!');
      });
  };

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

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  /************************Update User*************************************/
  /**************************Git users***********************************8*/
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(135);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => getData(), []);
  const getData = () => {
    console.log('Get Data');
    setLoading(true);
    fetch('https://api.github.com/users?since=' + offset)
      .then((response) => response.json())
      .then((json) => {
        setOffset(offset + 31);
        setData([...data, ...json]);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={getData}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {isLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };
  const Item = ({login, avatar_url}) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            //backgroundColor: 'red',
          }}>
          <Text style={styles.itemText}>{login}</Text>
        </View>
        <Image source={{uri: avatar_url}} style={styles.thumbnail} />
      </View>
    );
  };
  /**************************Git users***********************************8*/
  return (
    <>
      <View>
        <Header
          headerTitle="Profile"
          iconType="menu"
          onPress={() => navigation.openDrawer()}
          passwordIcon="unlock-alt"
          //onHeaderPress={() => console.log('Profile Header Change pass')}
        />
      </View>
      {/****************************Profile******************************************************/}
      <View style={{flex: 1, backgroundColor: '#f9fafd'}}>
        <ScrollView>
          <View>
            <SafeAreaView>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                // nestedScrollEnabled={true}
              >
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
                      {imageUri ? (
                        <Image
                          source={{uri: imageUri}}
                          style={styles.profileLogo}
                        />
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
                      )}
                    </TouchableOpacity>
                    <Text style={styles.text}>Profile</Text>
                    <View style={styles.fieldContainer}>
                      <View style={styles.emailContainer}>
                        <View style={{marginLeft: 16}}>
                          <FontAwesome name="envelope" size={30} />
                        </View>

                        <Text style={styles.emailText}>{user.email}</Text>
                      </View>

                      <View
                        style={{
                          // height: 40,
                          marginTop: 10,
                          // paddingHorizontal: 20,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#000',
                        }}>
                        {/* <IntlPhoneInput
                  onChangeText={(num) => numFormate(num)}
                  defaultCountry="IN"
                  placeholder="Phone Number"
                  containerStyle={{height: 35}}
                  phoneInputStyle={{
                    height: 40,
                    width: 50,
                  }}
                  flagStyle={{height: 50}}
                /> */}

                        <PhoneInput
                          value={
                            userData ? userData.phonenuber : userphoneNumber
                          }
                          defaultCode="IN"
                          onChangeText={(text) => {
                            setUserData({...userData, phonenuber: text});
                          }}
                          //onChangeFormattedText={(text) => {}}
                          layout="second"
                          countryPickerButtonStyle={{width: 50}}
                          codeTextStyle={{fontSize: 15, marginLeft: 6}}
                          textInputProps={{maxLength: 10}}
                          containerStyle={{
                            height: 37,
                            borderRadius: 10,
                            width: windowWidth / 1.21,
                          }}
                          textContainerStyle={{
                            height: 37,
                            borderRadius: 10,
                          }}
                          textInputStyle={{height: 37}}
                        />
                      </View>
                      {/* **********************Date Picker********************************************* */}
                      <View style={styles.dateTimeContainer}>
                        <FontAwesome
                          name="birthday-cake"
                          size={30}
                          onPress={showDatePicker}
                          style={styles.dateTimeLogoStyle}
                        />

                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={handleDateConfirm}
                          onCancel={hideDatePicker}
                          maximumDate={new Date(Date.now())}
                        />
                        <TouchableOpacity onPress={showDatePicker}>
                          <Text style={styles.dateTimeText}>
                            {userData ? userData.DateOfBirthf : userDateOfBirth}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* **********************Time Picker********************************************* */}
                      <View style={styles.dateTimeContainer}>
                        <FontAwesome
                          name="clock-o"
                          size={30}
                          onPress={showTimePicker}
                          style={styles.dateTimeLogoStyle}
                        />

                        <DateTimePickerModal
                          isVisible={isTimePickerVisible}
                          mode="time"
                          onConfirm={handleTimeConfirm}
                          onCancel={hideTimePicker}
                          is24Hour={true}
                        />
                        <TouchableOpacity onPress={showTimePicker}>
                          <Text
                            style={{
                              marginTop: 5,
                              marginLeft: 29,
                              fontSize: 16,
                            }}>
                            {userData ? userData.Scheduletime : userTime}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* **********************Date future Picker********************************************* */}
                      <View style={styles.dateTimeContainer}>
                        <FontAwesome
                          name="calendar"
                          size={30}
                          onPress={showFutureDatePicker}
                          style={styles.dateTimeLogoStyle}
                        />

                        <DateTimePickerModal
                          isVisible={isFuturePickerVisible}
                          mode="date"
                          onConfirm={handleFutureDateConfirm}
                          onCancel={hideFutureDatePicker}
                          minimumDate={new Date(Date.now())}
                        />
                        <TouchableOpacity onPress={showFutureDatePicker}>
                          <Text
                            style={{
                              marginTop: 5,
                              marginLeft: 29,
                              fontSize: 16,
                            }}>
                            {userData ? userData.Scheduledate : userFutureDate}{' '}
                            {}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.formButton}>
                        <FormButton
                          buttonTitle="Submit"
                          onPress={handleUpdate}
                        />
                      </View>
                    </View>
                    {/* <Text>{user.uid}</Text> */}
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
            </SafeAreaView>
          </View>
          {/***************************** Product View**************************** */}
          <View style={styles.productList}>
            <SafeAreaView>
              <ScrollView
                // contentContainerStyle={{height: 200}}
                nestedScrollEnabled={true}
                scrollEnabled={true}>
                <ProductsCompo
                  barVisible={false}
                  containerStyle={{flexGrow: 1}}
                />
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <FormButton
                    buttonTitle="Add"
                    onPress={() => navigation.navigate('Add Product')}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>

          {/***************************** Product View**************************** */}
          {/***************************** Git Users View**************************** */}
          <View style={{marginBottom: 15}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <FlatList
                contentContainerStyle={{flexDirection: 'row'}}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <Item login={item.login} avatar_url={item.avatar_url} />
                )}
                ListFooterComponent={renderFooter}
                // contentContainerStyle = {{flexGrow : 1}}
              />
            </ScrollView>
          </View>
          {/***************************** Git Users View**************************** */}
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: windowWidth / 1,
    //,
  },
  containerProducts: {
    flex: 1,
  },
  profileLogo: {
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
    //backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  emailContainer: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  emailText: {
    fontFamily: 'serif',
    fontSize: 20,
    marginLeft: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 3,
    //paddingHorizontal: 22,
  },
  dateTimeLogoStyle: {
    marginLeft: 16,
  },
  dateTimeText: {
    marginTop: 5,
    marginLeft: 24,
    fontSize: 16,
  },
  formButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  /***************Product list Style*******************/
  productList: {
    maxHeight: 250,
    marginLeft: 19,
    marginRight: 35,
    backgroundColor: '#f9fafd',
    marginBottom: 20,
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
  /*************Modal Style******************************************/

  /*********************Git ApI************************************/
  item: {
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: 'gray',
    borderTopWidth: 1,
    borderTopColor: 'gray',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'center',
    height: 115,
    width: 130,
    // marginVertical: 4,
    // marginHorizontal: 8,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderWidth: 2,
    borderColor: 'black',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  itemText: {
    paddingTop: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  /*********************Git ApI************************************/
});

export default ProfileScreen;
