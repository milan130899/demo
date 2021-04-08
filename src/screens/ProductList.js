import React from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../components/Header';
import ProductsCompo from '../components/ProductsCompo';
const ProductList = ({navigation}) => {
  return (
    <>
      <View>
        <Header
          headerTitle="Product List"
          iconType="menu"
          onPress={() => navigation.openDrawer()}
        />
      </View>

      <ProductsCompo barVisible={true} editIcon="pencil-square" />
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default ProductList;
