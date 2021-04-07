import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {showNotification, handleSchedule} from '../Notification';
const Notifications = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={{backgroundColor: 'skyblue', padding: 20, borderRadius: 25}}
        onPress={() => handleSchedule()}>
        <Text>Touch here to get notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Notifications;
