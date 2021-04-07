import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PhotoScreen from '../screens/PhotoScreen';
import EditProduct from '../screens/EditProduct';
const Stack = createStackNavigator();
const PhotoNavigation = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Photo" component={PhotoScreen} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
      </Stack.Navigator>
    </>
  );
};
export default PhotoNavigation;
