import React, {Component} from 'react';
import {
  AppRegistry,
  View,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';

var bgImg = require('../img/background.jpeg');
var logo = require('../img/logo.jpg');

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 2000);
  }
  render() {
    return (
      <ImageBackground source={bgImg} style={{height: '100%', width: '100%'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={logo} style={{height: 100, width: 100}}></Image>
        </View>
      </ImageBackground>
    );
  }
}
