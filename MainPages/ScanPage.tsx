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
import globalStyles from '../Styles/globalStyles';
import ItemBubble from '../Components/ItemBubble';

function ScanPage() {
  const [loading, setLoading] = React.useState(true);
  const [scannedItem, setScannedItem] = React.useState<Item>();

  const [currBarcode, setCurrBarcode] = React.useState<string>('');

  const camera = React.useRef();
  const navigate = useNavigation();

  async function fetchByBarcode(barcode) {
    if (barcode !== currBarcode) {
      const hebRef = firestore()
        .collection('stores')
        .doc('HEB')
        .collection('items');
      const barQuery = hebRef.where('barcode', '==', barcode);
      const BreakException = {};
      await barQuery.get().then(async qSnap => {
        try {
          qSnap.forEach(async (doc, index) => {
            const iteratedItem = new Item(doc);
            if (scannedItem && scannedItem.docID === iteratedItem.docID) {
              throw BreakException;
            } else {
              setScannedItem(iteratedItem);
              setCurrBarcode(barcode);
              setLoading(false);
            }
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }
      });
    }
  }

  function barcodeRecognized({barcodes}) {
    if (!barcodes[0].data.startsWith('{')) {
      fetchByBarcode(barcodes[0].data);
    }
  }

  return (
    <View style={styles.fullBackground}>
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
          {loading && scannedItem ? (
            <Text style={styles.scannedItemsText}>Scan a barcode</Text>
          ) : (
            <View style={styles.underCam}>
              <Text style={styles.scannedItemsText}>Scanned Item</Text>

              {scannedItem && (
                <ItemBubble
                  item={scannedItem}
                  navToItem={() =>
                    navigate.navigate('Scan', {
                      screen: 'ScanItemPage',
                      params: {itemIDCallback: scannedItem},
                    })
                  }
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default ScanPage;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fafafa',
  },

  cameraWindow: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },

  scannedItemsText: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0073FE',
    textAlign: 'center',
    alignSelf: 'stretch',
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
