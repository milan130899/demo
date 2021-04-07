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
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const Item = ({login, avatar_url, type, id}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const deleteUser = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  table_user where user_id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Please insert a valid User Id');
          }
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
          onChange={() => deleteUser()}
        />
      </View>
    </View>
  );
};

const GitSelected = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [flatListdata, setFlatListItems] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
    wait(2000).then(() => setRefreshing(false));

    //this.setToggleCheckBox(false);
  }, [refreshing]);

  useEffect(() => onRefresh(), []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        });
      });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      {refreshing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          // refreshing={refreshing}
          // onRefresh={onRefresh}
          data={flatListdata}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Item
              id={item.user_id}
              login={item.user_name}
              type={item.user_type}
              avatar_url={item.user_avtar}
            />
          )}
        />
      )}
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
export default GitSelected;
