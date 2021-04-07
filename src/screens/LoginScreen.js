import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
  Button,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {useState} from 'react';
import {useContext} from 'react';
import {AuthContext} from '../navigation/AuthProvider';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import Fonts from '../common/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [validEmail, setValidEmail] = useState(true);
  const [validPass, setValidPass] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const {login} = useContext(AuthContext);
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
    } else {
      setPassError('');
      login(email, password);
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
          <Image source={require('../img/loginLogo.png')} style={styles.logo} />
          <Text style={styles.text}>Login</Text>

          <FormInput
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            placeholderText="Email"
            iconType="user"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError ? <Text style={{color: 'red'}}>{emailError}</Text> : null}
          <FormInput
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
          {passError ? <Text style={{color: 'red'}}>{passError}</Text> : null}
          {/* <FormButton buttonTitle="Login" onPress={() => checking()} /> */}
          {/* <Button title="Login" onPress={() => checking()} /> */}
          <FormButton buttonTitle="Login" onPress={() => checking()} />
          <View style={styles.accountLine}>
            <Text style={styles.navButtonText}>don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp');
              }}>
              <Text
                style={{
                  ...styles.navButtonText,
                  color: '#2e64e5',
                  textDecorationLine: 'underline',
                }}>
                create here
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafd',
    padding: 30,
    width: windowWidth / 1,
    height: windowHeight / 1,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
    position: 'relative',
  },
  text: {
    fontFamily: 'TheBambankScript ',
    fontSize: 34,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  accountLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  navButtonText: {
    fontSize: 23,
    fontWeight: '500',
    color: '#051d5f',
    fontFamily: 'ROMANUS ',
  },
});
export default LoginScreen;
