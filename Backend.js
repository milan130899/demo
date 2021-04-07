import React, {useContext} from 'react';
import firebase from 'firebase';
import {AuthContext} from './src/navigation/AuthProvider';
const {user} = useContext(AuthContext);

class Backend {
  uid = user.uid;
  messagesRef = null;
  // initialize Firebase Backend
  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyCvXwk7rI0pVN63jYvn_eGz1dKspobkh1o',
      authDomain: 'loginsignup-96e30.firebaseapp.com',
      projectId: 'loginsignup-96e30',
      storageBucket: 'loginsignup-96e30.appspot.com',
      messagingSenderId: '220473869342',
      appId: '1:220473869342:web:21b9ddfc86032b1c0e1a0f',
      measurementId: 'G-9T5HJVKHTC',
    });
  }

  // retrieve the messages from the Backend
  loadMessages(callback) {
    this.messagesRef = firebase.database().ref('messages');
    this.messagesRef.off(); //Detaches a callback previously attached with on()
    const onReceive = (data) => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        //createdAt: new Date(message.createdAt),
        createdAt: message.createdAt,
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };

    var d = this.getLimit();
    console.log(d);

    this.messagesRef.orderByChild('createdAt').on('child_added', onReceive);
  }

  sendMessage(message) {
    var today = new Date();

    var timestamp = today.toISOString();
    for (let i = 0; i < message.length; i++) {
      this.messagesRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: timestamp,
      });
    }
  }
  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }

  getLimit() {
    var today = new Date();

    today.setDate(today.getDate() - 31); // last 30 Days

    var changedISODate = new Date(today).toISOString();

    console.log(changedISODate);
    return changedISODate;
  }
}

export default new Backend();
