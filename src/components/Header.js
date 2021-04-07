import * as React from 'react';
import {Button, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../common/Fonts';
import FormButton from './FormButton';
const Header = ({
  headerTitle,
  passwordIcon,
  iconType,
  navigation,
  onHeaderPress,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Ionicons
          style={styles.iconStyle}
          name={iconType}
          size={35}
          {...rest}
        />
      </View>
      <Text style={styles.headerTitleStyle}>{headerTitle}</Text>
      {/* <TouchableOpacity onPress={onHeaderPress}>
        <Text style={styles.headerbuttonStyle}>{headerbuttonTitle}</Text>
      </TouchableOpacity> */}
      <View>
        <FontAwesome style={styles.passIcon} name={passwordIcon} size={33} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerTitleStyle: {
    fontFamily: 'Perpetua',
    fontSize: 25,
  },
  // headerbuttonStyle: {
  //   fontFamily: Fonts.bambank,
  //   marginLeft: 85,
  //   height: windowHeight / 28,
  //   width: windowWidth / 2.5,

  //   paddingHorizontal: 5,
  // },
  passIcon: {
    height: windowHeight / 22,
    width: windowWidth / 7.5,
    marginLeft: 230,
  },
  iconStyle: {
    height: windowHeight / 22,
    width: windowWidth / 7.5,
    marginLeft: 7,
  },
  container: {
    backgroundColor: '#E3E3E3',
    height: windowHeight / 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 15,
    width: windowWidth / 1,
    height: windowHeight / 1,
    backgroundColor: '#2e64e5',
    //padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  buttonText: {
    fontSize: 10,
    fontFamily: 'Feather',
    fontWeight: 'bold',
    //color: Colors.black,
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
  },
});
export default Header;
