import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {useState} from 'react';
import {useContext} from 'react';
import Fonts from '../common/Fonts';
import {AuthContext} from '../navigation/AuthProvider';
import {windowHeight, windowWidth} from '../utils/Dimentions';

const PhoneNumber = ({navigation}) => {
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [otp, setOtp] = useState();
  const [phoneError, setPhoneError] = useState('');

  const device_id = DeviceInfo.getUniqueId();

  const checking = () => {
    if (!phoneNumber) {
      setPhoneError('Phone Number Requied');
      return;
    } else if (phoneNumber.length < 10) {
      setPhoneError('Enter 10 digits Number');
    } else {
      setPhoneError('');
      signInWithPhoneNumber('+91' + ' ' + phoneNumber);
    }
  };

  const signInWithPhoneNumber = async (phone_num) => {
    const confirmation = await auth().signInWithPhoneNumber(phone_num);
    setConfirm(confirmation);
  };

  const confirmCode = async (code) => {
    try {
      await confirm.confirm(code);
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.phoneNumber)
        .set({
          DateOfBirthf: '',
          Scheduledate: '',
          Scheduletime: '',
          emailid: auth().currentUser.phoneNumber,
          imageurl: null,
          phonenuber: auth().currentUser.phoneNumber,
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
    } catch (error) {
      alert('Invalid code.');
      console.log('Invalid code.');
    }
  };

  if (confirm) {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.inner}>
            <Text style={styles.text}>Enter OTP Here</Text>
            <FormInput
              labelValue={otp}
              onChangeText={(num) => setOtp(num)}
              placeholderText="Enter OTP"
              iconType="filetext1"
              keyboardType="number-pad"
              autoCorrect={false}
            />

            <FormButton buttonTitle="Submit" onPress={() => confirmCode(otp)} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.text}>Enter Your Phone Number</Text>
          <FormInput
            labelValue={phoneNumber}
            onChangeText={(num) => setPhoneNumber(num)}
            placeholderText="Enter Phone Number"
            iconType="phone"
            keyboardType="number-pad"
            maxLength={10}
            autoCorrect={false}
          />
          {phoneError ? <Text style={{color: 'red'}}>{phoneError}</Text> : null}
          <FormButton buttonTitle="Get OTP" onPress={() => checking()} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: Fonts.openSansLight,
    fontSize: 30,
    marginBottom: 10,
    color: '#051d5f',
  },

  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#051d5f',
    fontFamily: Fonts.bambank,
    marginTop: 15,
  },
});

export default PhoneNumber;
