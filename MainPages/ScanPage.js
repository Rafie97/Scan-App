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

class ScanPage extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      scannedItems: [],
    };
  }

  async fetchByBarcode(barcode) {
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items');
    const barQuery = hebRef.where('barcode', '==', barcode);
    const BreakException = {};
    await barQuery.get().then(async qSnap => {
      try {
        qSnap.forEach(async (doc, index) => {
          const item = new Item(doc);

          if (this.state.scannedItems.find(e => e.docID === item.docID)) {
            throw BreakException;
          } else {
            await this.setState({
              scannedItems: [...this.state.scannedItems, item],
              loading: false,
            });
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    });
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ImageBackground
        source={require('../res/grad_3.png')}
        style={styles.fullBackground}>
        <View style={styles.scanContainer}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.cameraWindow}
            ratio="1:1"
            onGoogleVisionBarcodesDetected={this.barcodeRecognized}
            autoFocus="on"
            captureAudio={false}
          />
          <View style={styles.underCam}>
            {this.state.loading && this.state.scannedItems.length == 0 ? (
              <Text style={styles.scannedItemsText}>
                Scan a barcode to show products
              </Text>
            ) : (
              <View style={styles.underCam}>
                <Text style={styles.scannedItemsText}>Scanned Items</Text>
                <FlatList
                  data={this.state.scannedItems}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem}
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }

  renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() =>
        this.props.navigation.navigate('Scan', {
          screen: 'ScanItemPage',
          params: {itemIDCallback: this.state.scannedItems[0]},
        })
      }>
      <View style={styles.itemBubble}>
        <Image source={{uri: item.imageLink}} style={styles.itemImage} />
        <Text style={styles.itemLabel}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  barcodeRecognized = ({barcodes}) => {
    barcodes.forEach(barcode => {
      if (!barcode.data.startsWith('{')) {
        //Filter out errors
        this.fetchByBarcode(barcode.data);
      }
    });
  };
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
    fontFamily: 'Segoe UI',
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
    fontFamily: 'Segoe UI',
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
