import React, {useEffect, useState, useContext} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import {SearchBar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {windowHeight, windowWidth} from '../utils/Dimentions';

const ProductsCompo = ({editIcon, barVisible, containerStyle}) => {
  const {user} = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState([]);

  /************************Get Products*************************************/
  const getData = () => {
    const subscribe = firestore()
      .collection('Products')
      .where('user_id', '==', user.uid)
      .onSnapshot((querySnapshot) => {
        const products = [];
        querySnapshot.forEach((documentSnapshot) => {
          products.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setData(products);
        setTemp(products);
        //console.log('**********', products);
      });
    return subscribe;
  };

  useEffect(() => getData(), []);
  /************************Get Products*************************************/

  /**********************Search Bar*************************************/
  const [searchText, setSearchText] = useState('');

  const updateSearch = (text) => {
    if (text) {
      const newData = data.filter(function (item) {
        const SEARCH = item.Title + item.Description;
        const searchFound =
          item.Title.toUpperCase() + item.Description.toUpperCase();
        const itemData = SEARCH ? searchFound : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setSearchText(text);
    } else {
      setData(temp);
      setSearchText(text);
    }
  };

  /**********************Search Bar*************************************/

  /**********************Render Item*************************************/
  const Item = ({title, description, user_id, img_url, pro_key, editIcon}) => {
    const navigation = useNavigation();
    return (
      <View style={styles.item}>
        <Image source={{uri: img_url}} style={styles.thumbnail} />
        <View style={{marginLeft: 10, flex: 2}}>
          <Text style={{...styles.itemText, marginTop: 10}}>
            <Text style={{fontWeight: 'bold'}}>Title : </Text>
            {title}
          </Text>
          <Text style={styles.itemText}>
            <Text style={{fontWeight: 'bold'}}>Description : </Text>{' '}
            {description}
          </Text>
          <Text style={styles.useridText}>
            <Text style={{fontWeight: 'bold'}}>Userid : </Text>
            <Text style={{fontSize: 8}}>{user_id}</Text>
          </Text>
        </View>
        <View style={styles.editBox}>
          <FontAwesome
            name={editIcon}
            size={30}
            onPress={() => {
              navigation.navigate('ProductEdit', {
                title,
                description,
                img_url,
                pro_key,
              });
            }}
          />
        </View>
      </View>
    );
  };
  /**********************Render Item*************************************/
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {barVisible ? (
            <SearchBar
              placeholder="Search here..."
              onChangeText={updateSearch}
              value={searchText}
              round
              lightTheme
              containerStyle={{}}
              inputContainerStyle={{height: windowHeight / 19}}
              inputStyle={{justifyContent: 'center', alignItems: 'center'}}
              searchIcon={{size: 30}}
            />
          ) : null}
          <FlatList
            data={data}
            //ListHeaderComponent={renderHeader}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Item
                title={item.Title}
                description={item.Description}
                user_id={item.user_id}
                img_url={item.ImageUrl}
                editIcon={editIcon}
                pro_key={item.key}
              />
            )}
            contentContainerStyle={containerStyle}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: windowHeight / 1,
    width: windowWidth / 1,
  },

  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingLeft: 10,
    backgroundColor: '#FFF',
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 20,
    shadowRadius: 9,
    elevation: 5,
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
    paddingLeft: 5,
    fontSize: 15,
  },
  useridText: {
    paddingTop: 5,
    paddingLeft: 5,
    fontSize: 15,
    marginRight: 5,
  },
  editBox: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 5,
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

export default ProductsCompo;
