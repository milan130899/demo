import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

const Item = ({login, avatar_url, type, id}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const insertUser = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (user_id, user_name, user_avtar,user_type) VALUES (?,?,?,?)',
        [id, login, avatar_url, type],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Registration Failed');
        },
      );
    });
  };
  return (
    <View style={styles.item}>
      <Image source={{uri: avatar_url}} style={styles.thumbnail} />
      <View style={{marginLeft: 10}}>
        <Text style={styles.itemText}>
          <Text style={{fontWeight: 'bold'}}>Name : </Text>
          {login}
        </Text>
        <Text style={styles.itemText}>
          <Text style={{fontWeight: 'bold'}}>id : </Text> {id}
        </Text>
        <Text style={styles.itemText}>
          <Text style={{fontWeight: 'bold'}}>Type : </Text> {type}
        </Text>
      </View>
      <View style={styles.checkbox}>
        <Checkbox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
          onChange={() => insertUser()}
        />
      </View>
    </View>
  );
};
const GitUsers = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(135);

  useEffect(() => getData(), []);
  useEffect(() => database(), []);
  const database = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY, user_name VARCHAR(50), user_avtar VARCHAR(100), user_type VARCHAR(50))',
              [],
            );
          }
        },
      );
    });
  };
  const getData = () => {
    console.log('Get Data');
    setLoading(true);
    fetch('https://api.github.com/users?since=' + offset)
      .then((response) => response.json())
      .then((json) => {
        setOffset(offset + 31);
        setData([...data, ...json]);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={getData}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {isLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Item
            id={item.id}
            login={item.login}
            type={item.type}
            avatar_url={item.avatar_url}
          />
        )}
        ListFooterComponent={renderFooter}
        // contentContainerStyle = {{flexGrow : 1}}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {},
  scrollView: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },

  enappdWrapper: {
    position: 'absolute',
    bottom: 0,
  },
  enappdIcon: {
    width: 100,
    height: 40,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 10,

    backgroundColor: '#C8C8C8',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 20,
    marginTop: 20,
  },
  itemText: {
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 18,
  },
  checkbox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
export default GitUsers;
