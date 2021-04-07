import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
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
      <SafeAreaView style={styles.container}>
        <ProductsCompo barVisible={true} editIcon="pencil-square" />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default ProductList;
