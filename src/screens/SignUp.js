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
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {useState} from 'react';
import {useContext} from 'react';
import Fonts from '../common/Fonts';
import {AuthContext} from '../navigation/AuthProvider';
import {windowHeight, windowWidth} from '../utils/Dimentions';

import Animated from 'react-native-reanimated';

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [validEmail, setValidEmail] = useState(true);
  const [validPass, setValidPass] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const {register} = useContext(AuthContext);

  const isValidEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const checking = () => {
    if (!email) {
      setEmailError('Email Requied');
      setValidEmail(false);
      return;
    } else if (!isValidEmail(email)) {
      setEmailError('Invalid Email');
      setValidEmail(false);
      return;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPassError('Password Requied');
      setValidPass(false);
    } else if (password.length < 6) {
      setPassError('minimum 5 chars required');
      setValidPass(false);
      return;
    } else {
      setPassError('');
      register(email, password);
    }
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
      //contentContainerStyle={styles.container}
    >
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.text}>Create An Account</Text>

          <FormInput
            labelValue={email}
            onChangeTextValue={(userEmail) => setEmail(userEmail)}
            placeholderText="Email"
            iconType="user"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError ? <Text style={{color: 'red'}}>{emailError}</Text> : null}

          <FormInput
            labelValue={password}
            onChangeTextValue={(userPassword) => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
          {passError ? <Text style={{color: 'red'}}>{passError}</Text> : null}

          {/* <FormInput
            labelValue={confirmPassword}
            onChangeText={(userPassword) => setConfirmPassword(userPassword)}
            placeholderText="Confirm Password"
            iconType="lock"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          /> */}
          <FormButton buttonTitle="Sign Up" onPress={checking} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: windowWidth / 1,
              marginTop: 10,
            }}>
            <Text style={styles.navButtonText}>Already Have An Account? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text
                style={{
                  ...styles.navButtonText,
                  color: '#2e64e5',
                  textDecorationLine: 'underline',
                }}>
                Sing In Here
              </Text>
            </TouchableOpacity>
          </View>
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
    fontFamily: Fonts.russeldexter,
    fontSize: 38,
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

export default SignUp;
