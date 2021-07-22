import {RNCamera} from 'react-native-camera';
import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import Item from '../Models/Item';
import {useNavigation} from '@react-navigation/native';

function ScanPage() {
  const [loading, setLoading] = React.useState(true);
  const [scannedItems, setScannedItems] = React.useState([]);
  const camera = React.useRef();

  const navigate = useNavigation();

  async function fetchByBarcode(barcode) {
    console.log('Barcode', barcode);
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items');
    const barQuery = hebRef.where('barcode', '==', barcode);
    const BreakException = {};
    await barQuery.get().then(async qSnap => {
      const newScannedItems = [];
      try {
        qSnap.forEach(async (doc, index) => {
          const item = new Item(doc);

          if (scannedItems.find(e => e.docID === item.docID)) {
            throw BreakException;
          } else {
            newScannedItems.push(item);
          }
        });
        setScannedItems(newScannedItems);
        setLoading(false);
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    });
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() =>
        navigate.navigate('Scan', {
          screen: 'ScanItemPage',
          params: {itemIDCallback: scannedItems[0]},
        })
      }>
      <View style={styles.itemBubble}>
        <Image source={{uri: item.imageLink}} style={styles.itemImage} />
        <Text style={styles.itemLabel}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const barcodeRecognized = ({barcodes}) => {
    barcodes.forEach(barcode => {
      if (!barcode.data.startsWith('{')) {
        //Filter out errors
        fetchByBarcode(barcode.data);
      }
    });
  };

  return (
    <ImageBackground
      source={require('../res/grad_3.png')}
      style={styles.fullBackground}>
      <View style={styles.scanContainer}>
        <RNCamera
          ref={camera}
          style={styles.cameraWindow}
          ratio="1:1"
          onGoogleVisionBarcodesDetected={barcodeRecognized}
          autoFocus="on"
          captureAudio={false}
        />
        <View style={styles.underCam}>
          {loading && scannedItems.length == 0 ? (
            <Text style={styles.scannedItemsText}>
              Scan a barcode to show products
            </Text>
          ) : (
            <View style={styles.underCam}>
              <Text style={styles.scannedItemsText}>Scanned Items</Text>
              <FlatList
                data={scannedItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
              />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

export default ScanPage;

const styles = StyleSheet.create({
  itemBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'row',
    width: 300,
    height: 60,
    marginTop: 20,
  },
  itemImage: {
    alignSelf: 'center',
    width: 45,
    height: 45,
    marginLeft: 20,
    marginRight: 0,
    backgroundColor: 'purple',
  },
  itemLabel: {
    alignSelf: 'center',
    marginLeft: 15,
    fontSize: 16,
  },
  itemPrice: {
    alignSelf: 'center',
    textAlign: 'right',
    marginLeft: 'auto',
    marginRight: 10,
  },

  cameraWindow: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },

  scannedItemsText: {
    marginTop: 200,
    marginBottom: 10,
    fontSize: 20,
  },

  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  scanContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },

  underCam: {
    height: 400,
    alignItems: 'center',
  },
});