import PushNotification from 'react-native-push-notification';

const showNotification = () => {
  PushNotification.localNotification({
    channelId: '123',
    title: 'Test Notification',
    message: 'This is Test Notification',
  });
};
const handleSchedule = () => {
  PushNotification.localNotificationSchedule({
    channelId: '123',
    title: 'Test Notification',
    message: 'This is Test Notification',
    date: new Date(Date.now() + 10 * 1000),
  });
};
export {showNotification, handleSchedule};
