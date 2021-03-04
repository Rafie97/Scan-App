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
import FamilyTile from '../Models/Components/FamilyTile';
import firestore from '@react-native-firebase/firestore';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import SelectableItem from '../Models/Components/SelectableItem';
import auth from '@react-native-firebase/auth';

export default class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlists: [],

      didCount: false,
      countContacts: 0,

      contactModal: false,
      contactsLoading: false,

      contactNames: [],
      filteredContactNames: [],

      selectedNames: [],
      tempSelectedNames: [],
    };

    this.getCount = this.getCount.bind(this);
    this.getLists = this.getLists.bind(this);
    this.getLocalContacts = this.getLocalContacts.bind(this);
    this.logItem = this.logItem.bind(this);
    this.pullContactsFirebase = this.pullContactsFirebase.bind(this);
    this.pushContactsFirebase = this.pushContactsFirebase.bind(this);
    this.initialContactState = this.initialContactState.bind(this);
  }

  async componentDidMount() {
    this.pullContactsFirebase();
    this.getCount();
    this.getLists();
    setTimeout(() => this.getLocalContacts(), 1000);
  }

  async signOut() {
    const userID = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart')
      .onSnapshot(() => {});
    firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlist')
      .onSnapshot(() => {});
    firestore()
      .collection('users')
      .doc(userID)
      .collection('Family')
      .onSnapshot(() => {});
    auth().signOut();
  }

  renderItem = ({item}) => (
    <SelectableItem
      name={item}
      logItem={this.logItem}
      initialState={this.initialContactState(item)}
    />
  );

  async getLists() {
    //Retrieve names of wishlists
    const userID = auth().currentUser.uid;
    const wishRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists');
    wishRef.onSnapshot(snap => {
      this.setState({wishlistSelect: []});
      snap.forEach((doc, index) => {
        this.setState({wishlists: [...this.state.wishlists, doc.id]});
      });
    });
  }

  // ============================== CONTACT METHODS ====================================

  getCount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    }).then(() => {
      Contacts.getCount(async count => {
        await this.setState({countContacts: count + 1, didCount: true});
      });
    });
  }

  async getLocalContacts() {
    if (this.state.didCount && this.state.contactNames.length !== 0) {
      try {
        const list = await AsyncStorage.getItem('storedContactNames');

        const parsedList = JSON.parse(list);

        if (parsedList) {
          const numStored = parsedList.length;

          if (numStored === this.state.countContacts) {
            await this.setState({
              contactNames: parsedList,
              contactsLoading: false,
              filteredContactNames: parsedList,
            });
          }
        } else {
          throw Error('No list');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (
      this.state.didCount &&
      (this.state.contactNames.length === 0 ||
        this.state.contactNames.length !== this.state.countContacts)
    ) {
      this.setState({contactsLoading: true});
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      }).then(() => {
        Contacts.getAll(async (err, contacts) => {
          if (err === 'denied') {
            alert('Contacts access was not granted');
          } else {
            if (contacts) {
              contacts.forEach(con => {
                this.setState({
                  contactNames: [...this.state.contactNames, con.givenName],
                });
              });
              this.setState({
                contactsLoading: false,
                filteredContactNames: this.state.contactNames,
              });
              const stringedContacts = JSON.stringify(this.state.contactNames);
              await AsyncStorage.setItem(
                'storedContactNames',
                stringedContacts,
              );
            }
          }
        });
      });
    }
  }

  searchContacts(val) {
    const tempFilteredList = [];
    this.state.contactNames.filter(name => {
      if (name.includes(val)) {
        tempFilteredList.push(name);
      }
    });
    if (tempFilteredList) {
      this.setState({filteredContactNames: tempFilteredList});
    }
    if (val === '') {
      this.setState({filteredContactNames: this.state.contactNames});
    }
  }

  logItem(name, isSelected) {
    if (isSelected) {
      this.setState({
        tempSelectedNames: [...this.state.tempSelectedNames, name],
      });
    }
    if (!isSelected) {
      let tempNames = this.state.tempSelectedNames;
      tempNames = tempNames.filter(item => item !== name);
      this.setState({tempSelectedNames: tempNames});
    }
  }

  async pullContactsFirebase() {
    const userID = auth().currentUser.uid;
    const famRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Family');

    const sub = famRef.onSnapshot(async snap => {
      this.setState({selectedNames: [], tempSelectedNames: []});
      snap.forEach(async doc => {
        await this.setState({
          selectedNames: [...this.state.selectedNames, doc.data().name],
          tempSelectedNames: [...this.state.tempSelectedNames, doc.data().name],
        });
      });
    });

    return () => sub();
  }

  async pushContactsFirebase() {
    this.setState({contactModal: false, contactsLoading: false});
    const userID = auth().currentUser.uid;
    const famRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Family');

    famRef.get().then(snap => {
      snap.forEach(doc => {
        if (!this.state.tempSelectedNames.includes(doc.data().name)) {
          famRef.doc(doc.id).delete();
        }
      });
    });

    this.state.tempSelectedNames.forEach(tempName => {
      if (!this.state.selectedNames.includes(tempName)) {
        famRef.add({
          name: tempName,
        });
      }
    });
  }

  initialContactState(name) {
    return this.state.selectedNames.includes(name);
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ImageBackground
        source={require('../res/grad_3.png')}
        style={styles.fullBackground}>
        <View style={styles.textView}>
          <Text style={styles.yourWishlistsText}>Your Account</Text>
          <TouchableOpacity
            style={{marginLeft: 50, marginRight: 20, alignSelf: 'center'}}
            onPress={() => this.signOut()}>
            <Text style={{color: 'blue', fontSize: 16, fontFamily: 'Segoe UI'}}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <TouchableOpacity
            onPress={e =>
              navigate('Account', {
                screen: 'WishlistPage',
              })
            }>
            <Text
              style={{fontSize: 20, alignSelf: 'center', marginVertical: 20}}>
              Wishlists
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: '#858585',
              width: '50%',
              borderBottomWidth: 1,
              alignSelf: 'center',
            }}
          />

          <Text style={{fontSize: 20, alignSelf: 'center', marginVertical: 20}}>
            Account Details
          </Text>

          <View
            style={{
              borderBottomColor: '#858585',
              width: '50%',
              borderBottomWidth: 1,
              alignSelf: 'center',
            }}
          />

          <Text style={{fontSize: 20, alignSelf: 'center', marginVertical: 20}}>
            Billing History
          </Text>
        </View>
        <View
          style={{flexDirection: 'column', position: 'absolute', bottom: 60}}>
          <Text style={{fontSize: 20, fontFamily: 'Segoe UI', marginLeft: 10}}>
            Your Family
          </Text>

          {this.state.contactsLoading ? (
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
              <Text style={{color: 'white', fontFamily: 'Segoe UI'}}>
                Loading...
              </Text>
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
              onPress={() => this.setState({contactModal: true})}>
              <Text style={{color: 'white', fontFamily: 'Segoe UI'}}>
                Add Family
              </Text>
            </TouchableOpacity>
          )}
          {this.state.selectedNames.length > 0 ? (
            <FlatList
              data={this.state.selectedNames}
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
                  fontFamily: 'Segoe UI',
                  paddingTop: 40,
                  height: 130,
                }}>
                No Family to show
              </Text>
            </View>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.contactModal}
          onRequestClose={() => this.setState({contactModal: false})}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Which contact would you like to add?
              </Text>
              <TextInput
                placeholder="Search contacts by name"
                onChangeText={val => this.searchContacts(val)}
              />

              <FlatList
                data={this.state.filteredContactNames}
                keyExtractor={(item, index) => index}
                initialNumToRender={100}
                renderItem={this.renderItem}
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
                  onPress={() =>
                    this.setState({contactModal: false, contactsLoading: false})
                  }>
                  <Text style={styles.title}>Cancel</Text>
                </TouchableOpacity>
                {this.state.selectedNames.length === 0 &&
                this.state.tempSelectedNames.length === 0 ? (
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
                    onPress={this.pushContactsFirebase}>
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
    fontFamily: 'Segoe UI',
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
    fontFamily: 'Segoe UI',
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

    fontFamily: 'Segoe UI',
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
    fontFamily: 'Segoe UI',
  },
});
