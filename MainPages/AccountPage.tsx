/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  AsyncStorage,
} from 'react-native';
require('react-native-linear-gradient').default;
import FamilyTile, {ReceiptTile, WishlistTile} from '../Components/Tiles';
import firestore from '@react-native-firebase/firestore';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import SelectableItem from '../Components/SelectableItem';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {Receipt} from '../Models/Receipt';

export default function AccountPage() {
  const [wishlists, setWishlists] = React.useState([]);

  const [didCount, setDidCount] = React.useState(false);
  const [countContacts, setCountContacts] = React.useState(0);

  const [contactModal, setContactModal] = React.useState(false);
  const [contactsLoading, setContactsLoading] = React.useState(false);

  const [contactNames, setContactNames] = React.useState([]);
  const [filteredContactNames, setFilteredContactNames] = React.useState([]);

  const [selectedNames, setSelectedNames] = React.useState([]);
  const [tempSelectedNames, setTempSelectedNames] = React.useState([]);

  const [currentBottomTabIndex, setCurrentBottomTabIndex] = React.useState(0);

  const [receipts, setReceipts] = React.useState<Receipt[]>([]);

  const navigate = useNavigation();

  //Get Family
  React.useEffect(() => {
    const userID = auth().currentUser.uid;
    const famRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Family');

    const sub = famRef.onSnapshot(async snap => {
      setSelectedNames([]);
      setTempSelectedNames([]);
      let newSelectedNames = [];
      snap.forEach(async doc => {
        newSelectedNames.push(doc.data().name);
      });
      setSelectedNames(newSelectedNames);
      setTempSelectedNames(newSelectedNames);
    });
    return sub;
  }, []);

  //Get Lists
  React.useEffect(() => {
    //Retrieve names of wishlists
    const userID = auth().currentUser.uid;
    const wishRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists');
    const sub = wishRef.onSnapshot(snap => {
      setWishlists([]);
      let newWishlists = [];
      snap.forEach(doc => {
        newWishlists.push(doc.id);
      });
      setWishlists(newWishlists);
    });
    return sub;
  }, []);

  //Get Receipts
  React.useEffect(() => {
    const userID = auth().currentUser.uid;
    const receiptRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Receipts');
    const sub = receiptRef.onSnapshot(snap => {
      setReceipts([]);
      let newReceipts = [];
      snap.forEach(doc => {
        newReceipts.push({
          id: doc.id,
          date: doc.data().date,
          storeId: doc.data().storeId,
        });
      });
      setReceipts(newReceipts);
    });
    return sub;
  }, []);

  async function signOut() {
    // const userID = auth().currentUser.uid;
    // firestore()
    //   .collection('users')
    //   .doc(userID)
    //   .collection('Cart')
    //   .onSnapshot(() => {});
    // firestore()
    //   .collection('users')
    //   .doc(userID)
    //   .collection('Wishlist')
    //   .onSnapshot(() => {});
    // firestore()
    //   .collection('users')
    //   .doc(userID)
    //   .collection('Family')
    //   .onSnapshot(() => {});
    // firestore()
    //   .collection('users')
    //   .doc(userID)
    //   .collection('Wishlists')
    //   .onSnapshot(() => {});

    // firestore()
    //   .collection('stores')
    //   .doc('HEB')
    //   .collection('items')
    //   .onSnapshot(() => {});
    auth().signOut();
  }

  const renderItem = ({item}) => (
    <SelectableItem
      name={item}
      logItem={logItem}
      initialState={initialContactState(item)}
    />
  );

  // ============================== CONTACT METHODS ====================================

  function getCount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    }).then(() => {
      console.log('GOT PERMSSIONS');
      // Contacts.getCount(async function count => {
      //   await setCountContacts(count + 1)
      // set DidCount(true)
      // });
    });
  }

  async function getLocalContacts() {
    if (didCount && contactNames.length !== 0) {
      try {
        const list = await AsyncStorage.getItem('storedContactNames');

        const parsedList = JSON.parse(list);

        if (parsedList) {
          const numStored = parsedList.length;

          if (numStored === countContacts) {
            await setContactNames(parsedList);
            await setContactsLoading(false);
            await setFilteredContactNames(parsedList);
          }
        } else {
          throw Error('No list');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (
      didCount &&
      (contactNames.length === 0 || contactNames.length !== countContacts)
    ) {
      setContactsLoading(true);
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      }).then(() =>
        Contacts.getAll(async (err, contacts) => {
          if (err === 'denied') {
            alert('Contacts access was not granted');
          } else if (contacts) {
            contacts.forEach(con =>
              setContactNames([...contactNames, con.givenName]),
            );

            setContactsLoading(false);
            setFilteredContactNames(contactNames);

            const stringedContacts = JSON.stringify(contactNames);
            await AsyncStorage.setItem('storedContactNames', stringedContacts);
          }
        }),
      );
    }
  }

  function searchContacts(val) {
    const tempFilteredList = [];
    contactNames.filter(name => {
      if (name.includes(val)) {
        tempFilteredList.push(name);
      }
    });
    if (tempFilteredList) {
      setFilteredContactNames(tempFilteredList);
    }
    if (val === '') {
      setFilteredContactNames(contactNames);
    }
  }

  function logItem(name, isSelected) {
    if (isSelected) {
      setTempSelectedNames([...tempSelectedNames, name]);
    }
    if (!isSelected) {
      let tempNames = tempSelectedNames;
      tempNames = tempNames.filter(item => item !== name);
      setTempSelectedNames(tempNames);
    }
  }
  // ============================== END CONTACT METHODS ====================================

  async function pushContactsFirebase() {
    setContactModal(false);
    setContactsLoading(false);
    const userID = auth().currentUser.uid;
    const famRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Family');

    famRef.get().then(snap => {
      snap.forEach(doc => {
        if (!tempSelectedNames.includes(doc.data().name)) {
          famRef.doc(doc.id).delete();
        }
      });
    });

    tempSelectedNames.forEach(tempName => {
      if (!selectedNames.includes(tempName)) {
        famRef.add({
          name: tempName,
        });
      }
    });
  }

  function initialContactState(name) {
    return selectedNames.includes(name);
  }

  function BottomBarContent() {
    if (currentBottomTabIndex === 0) {
      return (
        <View>
          {contactsLoading ? (
            <View
              style={{
                backgroundColor: '#1B263B',
                borderWidth: 1,
                height: 30,
                width: 100,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
              }}>
              <Text style={{color: 'white'}}>Loading...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#1B263B',
                borderWidth: 1,
                height: 30,
                width: 100,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
              }}
              onPress={() => setContactModal(true)}>
              <Text style={{color: 'white'}}>Add Family</Text>
            </TouchableOpacity>
          )}
          {selectedNames.length > 0 ? (
            <FlatList
              data={selectedNames}
              horizontal={true}
              renderItem={({item}) => <FamilyTile name={item} />}
            />
          ) : (
            <View
              style={{
                width: 415,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,

                  paddingTop: 40,
                  height: 130,
                }}>
                There is no Family to show
              </Text>
            </View>
          )}
        </View>
      );
    }

    if (currentBottomTabIndex === 1) {
      return (
        <View>
          <FlatList
            data={wishlists}
            horizontal={true}
            renderItem={({item}) => <WishlistTile name={item} />}
          />
        </View>
      );
    }

    if (currentBottomTabIndex === 2 && receipts.length > 0) {
      return (
        <View>
          <FlatList
            data={receipts}
            horizontal={true}
            renderItem={({item}) => <ReceiptTile receipt={item} />}
          />
        </View>
      );
    }
  }

  return (
    <ImageBackground
      source={require('../res/grad_3.png')}
      style={styles.fullBackground}>
      <View style={styles.textView}>
        <Text style={styles.yourWishlistsText}>Your Account</Text>
        <TouchableOpacity
          style={{marginLeft: 50, marginRight: 20, alignSelf: 'center'}}
          onPress={() => signOut()}>
          <Text style={{color: 'blue', fontSize: 16}}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../res/default_profile.jpg')}
            style={{
              width: 140,
              height: 140,
              borderRadius: 10,
              borderColor: '#dddddd',
              borderWidth: 2,
              marginHorizontal: 10,
            }}
          />
          <View style={{flexDirection: 'column'}}>
            <Text
              style={[
                styles.personalInfoText,
                {fontWeight: 'bold', marginTop: 15, marginBottom: 20},
              ]}>
              Rafa Josh
            </Text>
            <Text style={styles.personalInfoText}>Main Shop: H-E-B</Text>
            <Text style={styles.personalInfoText}>
              Phone Number: 512-363-8986
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          position: 'absolute',
          bottom: 60,
          paddingBottom: 180,
          width: '100%',
        }}>
        <View style={{flexDirection: 'row', marginBottom: 40, width: '100%'}}>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(0);
            }}
            style={{flex: 1, borderRightWidth: 2}}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                fontWeight: currentBottomTabIndex === 0 ? 'bold' : 'normal',
              }}>
              Family
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(1);
            }}
            style={{flex: 1, borderRightWidth: 2}}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                fontWeight: currentBottomTabIndex === 1 ? 'bold' : 'normal',
              }}>
              Wishlists
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(2);
            }}
            style={{flex: 1}}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                fontWeight: currentBottomTabIndex === 2 ? 'bold' : 'normal',
              }}>
              Receipts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          position: 'absolute',
          bottom: 60,
          paddingBottom: 20,
        }}>
        {BottomBarContent()}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModal}
        onRequestClose={() => setContactModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Which contacts would you like to add?
            </Text>
            <TextInput
              placeholder="Search contacts by name"
              onChangeText={val => searchContacts(val)}
            />

            <FlatList
              data={filteredContactNames}
              initialNumToRender={100}
              renderItem={renderItem}
            />

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 40,
                  borderWidth: 1,
                  justifyContent: 'center',
                  marginTop: 20,
                }}
                onPress={() => {
                  setContactModal(false);
                  setContactsLoading(false);
                }}>
                <Text style={styles.title}>Cancel</Text>
              </TouchableOpacity>
              {selectedNames.length === 0 && tempSelectedNames.length === 0 ? (
                <></>
              ) : (
                <TouchableOpacity
                  style={{
                    width: 80,
                    height: 40,
                    borderWidth: 1,
                    justifyContent: 'center',
                    marginTop: 20,
                    marginLeft: 20,
                  }}
                  onPress={pushContactsFirebase}>
                  <Text style={styles.title}>Ok</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  wishlistButton: {
    backgroundColor: 'grey',
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    alignSelf: 'center',
  },

  wishlistGroupView: {
    padding: 30,
    paddingTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: 'black',
  },
  yourWishlistsText: {
    fontSize: 24,
  },
  textView: {
    marginTop: 40,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  ItemImage: {
    alignSelf: 'flex-start',
    width: 30,
    height: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  itemLabel: {
    alignSelf: 'center',
    marginLeft: 40,
    fontSize: 16,
  },
  wishlistSelect: {
    borderWidth: 2,
    marginLeft: 20,
    marginTop: 20,
    height: 40,
    width: 250,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 500,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  personalInfoText: {
    marginVertical: 5,
    fontSize: 18,
  },
});
