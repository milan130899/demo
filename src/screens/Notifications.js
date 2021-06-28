// import React from 'react';
// import {Text, View, TouchableOpacity} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import CryptoJS from 'crypto-js';
// import {showNotification, handleSchedule} from '../Notification';
// const Notifications = () => {
//   const handlepick = async () => {
//     // try {
//     //   const results = await DocumentPicker.pickMultiple({
//     //     type: [DocumentPicker.types.allFiles],
//     //   });
//     //   for (const res of results) {
//     //     console.log(
//     //       res.uri,
//     //       res.type, // mime type
//     //       res.name,
//     //       res.size,
//     //     );
//     //   }
//     // } catch (err) {
//     //   if (DocumentPicker.isCancel(err)) {
//     //     // User cancelled the picker, exit any dialogs or menus and move on
//     //   } else {
//     //     throw err;
//     //   }
//     // }
//     // Encrypt
//     var ciphertext = CryptoJS.AES.encrypt(
//       'my message',
//       'secret key 123',
//     ).toString();
//     console.log('ENCC---', ciphertext);
//     // Decrypt
//     var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
//     var originalText = bytes.toString(CryptoJS.enc.Utf8);

//     console.log(originalText); // 'my message'
//   };
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <TouchableOpacity
//         style={{backgroundColor: 'skyblue', padding: 20, borderRadius: 25}}
//         onPress={() => handleSchedule()}>
//         <Text>Touch here to get notifications</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={{
//           backgroundColor: 'skyblue',
//           padding: 20,
//           borderRadius: 25,
//           marginTop: 20,
//         }}
//         onPress={() => handlepick()}>
//         <Text>Touch here to Pick</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Notifications;
import React, {Component} from 'react';
import {
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

const BACON_IPSUM =
  'Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';

const CONTENT = [
  {
    title: 'First',
    content: BACON_IPSUM,
  },
  {
    title: 'Second',
    content: BACON_IPSUM,
  },
  {
    title: 'Third',
    content: BACON_IPSUM,
  },
  {
    title: 'Fourth',
    content: BACON_IPSUM,
  },
  {
    title: 'Fifth',
    content: BACON_IPSUM,
  },
];

const SELECTORS = [
  {
    title: 'First',
    value: 0,
  },
  {
    title: 'Third',
    value: 2,
  },
  {
    title: 'None',
  },
];

export default class Notifications extends Component {
  state = {
    activeSections: [],
    collapsed: true,
    multipleSelect: false,
  };

  toggleExpanded = () => {
    this.setState({collapsed: !this.state.collapsed});
  };
  //
  setSections = (sections) => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Text animation={isActive ? 'bounceIn' : undefined}>
          {section.content}
        </Text>
      </View>
    );
  }

  render() {
    const {multipleSelect, activeSections} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{paddingTop: 30}}>
          <Text style={styles.title}>Accordion Example</Text>

          <View style={styles.multipleToggle}>
            <Text style={styles.multipleToggle__title}>Multiple Select?</Text>
            <Switch
              value={multipleSelect}
              onValueChange={(a) => this.setState({multipleSelect: a})}
            />
          </View>

          <Accordion
            activeSections={activeSections}
            sections={CONTENT}
            touchableComponent={TouchableOpacity}
            expandMultiple={multipleSelect}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent}
            duration={400}
            onChange={this.setSections}
            renderAsFlatList={false}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    //paddingTop: Constants.statusBarHeight,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});
