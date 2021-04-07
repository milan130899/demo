import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GitUsers from '../screens/GitUsers';
import GitSelected from '../screens/GitSelected';
import Header from '../components/Header';

const TopTab = createMaterialTopTabNavigator();
const UsersScreenTab = ({navigation}) => {
  return (
    <>
      <View>
        <Header
          headerTitle="Users"
          iconType="menu"
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <TopTab.Navigator>
        <TopTab.Screen name="Users" component={GitUsers} />
        <TopTab.Screen name="Users Selected" component={GitSelected} />
      </TopTab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UsersScreenTab;
