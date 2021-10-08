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

import DropDownPicker from 'react-native-dropdown-picker';

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
import FontAwe from 'react-native-vector-icons/FontAwesome';
import FontAwe5 from 'react-native-vector-icons/FontAwesome5';
import Ion from 'react-native-vector-icons/Ionicons';
import globalStyles from '../Styles/globalStyles';

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

  const [editProfile, setEditProfile] = React.useState<boolean>(false);
  const [userName, setUserName] = React.useState<string>();
  const [typedName, setTypedName] = React.useState<string>();
  const userID = auth().currentUser.uid;

  const navigate = useNavigation();

  //Get User Info
  React.useEffect(() => {
    const userRef = firestore()
      .collection('users')
      .doc(userID);
    userRef.get().then(data => setUserName(data.data().name));
  }, []);

  //Get Family
  React.useEffect(() => {
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

  React.useEffect(() => {
    async () => {
      pullContactsFirebase();
      getCount();
      setTimeout(() => getLocalContacts(), 1000);
    };
  });

  //Get Lists
  React.useEffect(() => {
    //Retrieve names of wishlists
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

  async function pullContactsFirebase() {
    const userID = auth().currentUser.uid;
    const famRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Family');

    famRef.onSnapshot(async snap => {
      setSelectedNames([]);
      setTempSelectedNames([]);
      snap.forEach(async doc => {
        setSelectedNames([...selectedNames, doc.data().name]);
        setTempSelectedNames([...tempSelectedNames, doc.data().name]);
      });
    });
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
    const [selected, setSelected] = React.useState('');
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    if (currentBottomTabIndex === 0) {
      return (
        <View>
          {contactsLoading ? (
            <View
              style={{
                backgroundColor: '#0073FE',
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
                height: 30,
                width: '40%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
              onPress={() => setContactModal(true)}>
              <Text style={{color: '#0073FE', fontSize: 18}}>
                <FontAwe name="plus-square" size={18} color="#0073FE" /> Add
                Family
              </Text>
            </TouchableOpacity>
          )}
          {selectedNames.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
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
          <TouchableOpacity
            style={{
              height: 30,
              width: '40%',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Text style={{color: '#0073FE', fontSize: 18}}>
              <FontAwe name="plus-square" size={18} color="#0073FE" /> Add
              Wishlist
            </Text>
          </TouchableOpacity>
          <FlatList
            showsHorizontalScrollIndicator={false}
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
          <View
            style={{
              flexDirection: 'row',
              height: 30,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              marginLeft: 10,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16}}>Sort: </Text>
              <DropDownPicker
                items={[
                  {label: 'Date', value: 'date'},
                  {label: 'Store Name', value: 'store'},
                ]}
                open={dropdownOpen}
                setOpen={op => setDropdownOpen(op)}
                value={selected}
                setValue={setSelected}
                style={{height: 35}}
                containerStyle={{width: 160}}
              />
            </View>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={receipts}
            horizontal={true}
            renderItem={({item}) => <ReceiptTile receipt={item} />}
          />
        </View>
      );
    }
  }

  return (
    <View style={globalStyles.fullBackground}>
      <View style={styles.textView}>
        <Text style={styles.yourWishlistsText}>Your Account</Text>
        <TouchableOpacity
          style={{
            marginRight: 20,
          }}
          onPress={() => signOut()}>
          <Text
            style={{
              color: '#0073FE',
              fontSize: 18,
              textAlign: 'right',
              flex: 1,
              paddingVertical: 5,
              alignSelf: 'stretch',
            }}>
            <Ion name="md-exit-outline" size={24} color="#0073FE" />
            {'  '}
            Sign out
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'column', width: '100%'}}>
        <View style={styles.personalInfoCard}>
          <Image
            source={require('../res/default_profile.jpg')}
            style={{
              width: 130,
              height: 130,
              borderRadius: 10,
              borderColor: '#0073FE',
              borderWidth: 2,
              marginHorizontal: 10,
            }}
          />
          <View style={{flexDirection: 'column'}}>
            {editProfile ? (
              <TextInput
                placeholder="Name"
                style={{fontSize: 18, borderWidth: 1, marginBottom: 8}}
                onChangeText={val => setTypedName(val)}
              />
            ) : (
              <Text
                style={[
                  styles.personalInfoText,
                  {fontWeight: 'bold', marginTop: 15, marginBottom: 20},
                ]}>
                {userName}
              </Text>
            )}

            <Text style={styles.personalInfoText}>
              <FontAwe name="phone" size={18} color="#0073FE" />
              {'   '}
              512.363.8986
            </Text>

            <Text style={styles.personalInfoText}>
              <Ion name="location-sharp" size={18} color="#0073FE" />
              {'  '}
              H-E-B
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              if (editProfile && typedName && typedName !== userName) {
                setUserName(typedName);
                const userRef = firestore()
                  .collection('users')
                  .doc(userID);
                userRef.set({
                  name: typedName,
                });
              }
              setEditProfile(!editProfile);
            }}
            style={{marginBottom: 30, marginTop: 20}}>
            <Text
              style={{
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#0073FE',
                fontSize: 20,
                textAlign: 'center',
                height: 60,
                width: '90%',
                paddingVertical: 15,
                color: '#0073FE',
                fontWeight: 'bold',
              }}>
              {editProfile ? 'Save Profile' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 1,
                fontSize: 20,
                textAlign: 'center',
                height: 60,
                width: '90%',
                paddingVertical: 15,
                fontWeight: 'bold',
              }}>
              Payment Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fullBottomCard}>
        <View
          style={{
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TouchableOpacity
              onPress={() => {
                setCurrentBottomTabIndex(0);
              }}
              style={{flex: 1, borderRightWidth: 2}}>
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'stretch',
                  textAlign: 'center',
                  fontWeight: currentBottomTabIndex === 0 ? 'bold' : 'normal',
                }}>
                <Ion name="people" color="#0073FE" size={20} /> Family
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
                  alignSelf: 'stretch',
                  textAlign: 'center',
                  fontWeight: currentBottomTabIndex === 1 ? 'bold' : 'normal',
                }}>
                <FontAwe name="heart" color="#0073FE" size={18} /> Wishlists
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
                  alignSelf: 'stretch',
                  textAlign: 'center',
                  fontWeight: currentBottomTabIndex === 2 ? 'bold' : 'normal',
                }}>
                <FontAwe5 name="receipt" color="#0073FE" size={18} /> Receipts
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            padding: 20,
          }}>
          {BottomBarContent()}
        </View>
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
              showsHorizontalScrollIndicator={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  fullBottomCard: {
    width: '90%',
    paddingTop: 10,
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 9.11,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    alignSelf: 'center',
  },

  yourWishlistsText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  textView: {
    width: '100%',
    marginTop: 30,
    marginBottom: 40,
    flexDirection: 'row',
    alignSelf: 'stretch',
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

  personalInfoCard: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    // borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 9.11,
    elevation: 5,
  },
  personalInfoText: {
    marginVertical: 5,
    fontSize: 18,
  },
});
