import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  PermissionsAndroid,
  Platform,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import PlacesInput from 'react-native-places-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

navigator.geolocation = require('react-native-geolocation-service');

const MapScreen = ({navigation}) => {
  const [marginBottom, setmarginBottom] = useState(1);
  const [userLocation, setUserLocation] = useState(false);
  const [region] = useState({
    latitude: 23.010544306767688,
    longitude: 72.50804901123048,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [polygons, setPolygons] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creatingHole] = useState(false);
  let id = 0;
  const coordinates = [
    {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    },
    {
      latitude: 23.22573,
      longitude: 432.638493,
    },
    {
      latitude: 23.226555,
      longitude: 72.629629,
    },
    {
      latitude: 23.21918,
      longitude: 72.618428,
    },
  ];
  const onPress = (e) => {
    if (!editing) {
      setEditing({
        id: id++,
        coordinates: [e.nativeEvent.coordinate],
        holes: [],
      });
    } else if (!creatingHole) {
      setEditing({
        ...editing,
        coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
      });
    } else {
      const holes = [...editing.holes];
      holes[holes.length - 1] = [
        ...holes[holes.length - 1],
        e.nativeEvent.coordinate,
      ];
      setEditing({
        ...editing,
        id: id++, // keep incrementing id to trigger display refresh
        coordinates: [...editing.coordinates],
        holes,
      });
    }
  };
  useEffect(() => {
    function getUserLocation() {
      requestLocationPermission();
    }
    getUserLocation();
  }, []);

  async function requestLocationPermission() {
    var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (response == 'granted') {
      await Geolocation.getCurrentPosition(
        ({coords}) => {
          setUserLocation(coords);
        },
        (error) => {
          Alert.alert(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000,
        },
      );
    }
  }

  //**************Map View Basic***************************************/

  if (!userLocation) return <ActivityIndicator />;
  const mapOptions = {
    scrollEnabled: true,
  };

  if (editing) {
    mapOptions.scrollEnabled = false;
    mapOptions.onPanDrag = (e) => onPress(e);
  }
  return (
    <>
      <View>
        <Header
          headerTitle="Maps"
          iconType="menu"
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <MapView
            style={[styles.mapStyle, {marginBottom: marginBottom}]}
            initialRegion={region}
            // customMapStyle={mapStyle}
            onPress={(e) => onPress(e)}
            showsMyLocationButton={true}
            showsUserLocation={true}
            onMapReady={() => {
              setmarginBottom(0);
            }}
            {...mapOptions}>
            <Marker
              title="user-location"
              description="this is user loc marker"
              coordinate={coordinates[0]}>
              <Image
                source={require('../img/location.png')}
                style={{width: 56, height: 58}}
                resizeMode="contain"
              />
            </Marker>
            {/* <Marker title="Marker 2" coordinate={coordinates[1]}>
              <Image
                source={require('../img/location.png')}
                style={{width: 56, height: 58}}
                resizeMode="contain"
              />
            </Marker>
            <Marker title="Marker 3" coordinate={coordinates[2]}>
              <Image
                source={require('../img/location.png')}
                style={{width: 56, height: 58}}
                resizeMode="contain"
              />
            </Marker>
            <Marker title="Marker 4" coordinate={coordinates[3]}>
              <Image
                source={require('../img/location.png')}
                style={{width: 56, height: 58}}
                resizeMode="contain"
              />
            </Marker> */}

            {/* <MapViewDirections
              origin={coordinates[0]}
              destination={coordinates[1]}
              apikey="AIzaSyCNm9fG3Nw6ksVnO6PbK4wQ_UQ-KhpInSM"
              strokeWidth={3}
              strokeColor="hotpink"
            /> */}
            {/* <Polygon
              coordinates={coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={2}
            /> */}
            {polygons.map((polygon) => (
              <Polygon
                key={polygon.id}
                coordinates={polygon.coordinates}
                holes={polygon.holes}
                strokeColor="#F00"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={1}
              />
            ))}
            {editing && (
              <Polygon
                key={editing.id}
                coordinates={editing.coordinates}
                holes={editing.holes}
                strokeColor="#000"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={1}
              />
            )}
          </MapView>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  searchBar: {
    backgroundColor: 'red',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MapScreen;

///////////////////////////////////////////////////////////////////////////////
