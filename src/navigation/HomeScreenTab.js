import React from 'react';
import {useContext} from 'react';
import {Button, Text, View, StyleSheet, Image} from 'react-native';
import {AuthContext} from './AuthProvider';
import {DrawerActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PhotoScreen from '../screens/PhotoScreen';
import UsersScreenTab from './UsersScreenTab';
import ChatScreen from './../screens/ChatScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreenTab = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName="Photo"
      //activeColor="#ffffff"
      barStyle={{backgroundColor: 'tomato'}}>
      <Tab.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          tabBarLabel: 'Photo',

          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="camera" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreenTab}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="face-profile"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="file-document"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default HomeScreenTab;
