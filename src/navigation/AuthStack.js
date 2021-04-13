import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createStackNavigator} from '@react-navigation/stack';
import SpalshScreen from '../../src/components/SpalshScreen';
import LoginScreen from '../../src/screens/LoginScreen';
import SignUp from '../../src/screens/SignUp';
import PhoneNumber from '../phoneAuth/PhoneNumber';

const Stack = createStackNavigator();

const AuthStack = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '220473869342-nmbftch7ln6gnst6a3v36ko65lslcjh2.apps.googleusercontent.com',
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Spalsh" component={SpalshScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="PhoneAuth" component={PhoneNumber} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AuthStack;
