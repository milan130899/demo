import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreenTab from './HomeScreenTab';
import Product from '../screens/Product';
import ProductList from '../screens/ProductList';
import EditProduct from '../screens/EditProduct';
import Notifications from '../screens/Notifications';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MapSearch from '../screens/MapsSearch';

import ProductsCompo from '../components/ProductsCompo';
import AddRoomScreen from './../screens/AddRoomScreen';
import GroupScreen from './../screens/GroupScreen';
import ChatScreen from '../screens/ChatScreen';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const AppStack = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Drawer" component={DrawerNavigation} />
        <Stack.Screen name="Home" component={Root} />
        <Stack.Screen name="Maps" component={MapSearch} options={{}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{}} />
        <Stack.Screen name="Add Product" component={Product} options={{}} />
        <Stack.Screen name="Product List" component={ProductList} />
      </Stack.Navigator>
    </>
  );
};
const DrawerNavigation = () => {
  return (
    <>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={HomeScreenTab}
          //options={{headerShown: false}}
        />
        <Drawer.Screen name="Maps" component={MapSearch} options={{}} />
        <Drawer.Screen name="Profile" component={ProfileScreen} options={{}} />
        <Drawer.Screen name="Add Product" component={Product} options={{}} />
        <Drawer.Screen name="Product List" component={ProductStack} />
        <Drawer.Screen name="Notifications" component={Notifications} />
        <Drawer.Screen name="Room" component={chatStacks} />
      </Drawer.Navigator>
    </>
  );
};
const Root = () => {
  return (
    <>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen
          name="Home"
          component={HomeScreenTab}
          //options={{headerShown: false}}
        />
        <RootStack.Screen name="Maps" component={MapSearch} options={{}} />
        <RootStack.Screen name="Profile" component={ProfileScreen} />
        <RootStack.Screen name="Add Product" component={Product} options={{}} />
        <RootStack.Screen name="Product List" component={ProductList} />
      </RootStack.Navigator>
    </>
  );
};
const proStack = createStackNavigator();
const ProductStack = () => {
  return (
    <proStack.Navigator screenOptions={{headerShown: false}}>
      <proStack.Screen name="ProductList" component={ProductList} />
      <proStack.Screen name="component" component={ProductsCompo} />
      <proStack.Screen name="ProductEdit" component={EditProduct} />
    </proStack.Navigator>
  );
};

const chatStack = createStackNavigator();
const chatStacks = () => {
  return (
    <chatStack.Navigator screenOptions={{headerShown: false}}>
      <chatStack.Screen name="Groups" component={GroupScreen} />
      <chatStack.Screen name="AddRoom" component={AddRoomScreen} />
      <chatStack.Screen
        name="Chats"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params.thread.name,
        })}
      />
    </chatStack.Navigator>
  );
};
const styles = StyleSheet.create({});

export default AppStack;
