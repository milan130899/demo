import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import Colors from '../common/Colors';
const FormButton = ({buttonTitle, ...rest}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
    width: windowWidth / 3,
    height: windowHeight / 20,
    backgroundColor: '#2e64e5',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Feather',
    fontWeight: 'bold',
    //color: Colors.black,
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
  },
});

export default FormButton;
