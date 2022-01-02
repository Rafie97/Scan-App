/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage} from 'react-native';

require('react-native-linear-gradient').default;
import firestore from '@react-native-firebase/firestore';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import auth from '@react-native-firebase/auth';
import Receipt from '../../Models/CartModels/Receipt';
import Ion from 'react-native-vector-icons/Ionicons';
import gs from '../../Styles/globalStyles';
import BottomTabsCard from './AccountComponents/BottomTabs/BottomTabsCard';
import PersonalInfoCard from './AccountComponents/PersonalInfoCard';
import BottomTabsContent from './AccountComponents/BottomTabs/BottomTabsContent';
import ContactsModal from './AccountComponents/ContactsModal';
import {useDispatch, useStore} from '../../Reducers/store';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import useAuth from '../../Auth_Components/AuthContext';

export default function AccountPage() {
  const [didCount, setDidCount] = React.useState(false);
  const [countContacts, setCountContacts] = React.useState(0);

  const [contactModal, setContactModal] = React.useState(false);
  const [contactsLoading, setContactsLoading] = React.useState(false);

  const [contactNames, setContactNames] = React.useState([]);
  const [filteredContactNames, setFilteredContactNames] = React.useState([]);

  const [selectedNames, setSelectedNames] = React.useState([]);
  const [tempSelectedNames, setTempSelectedNames] = React.useState([]);

  const [currentBottomTabIndex, setCurrentBottomTabIndex] = React.useState(0);

  const [editProfile, setEditProfile] = React.useState<boolean>(false);
  const [userName, setUserName] = React.useState<string>();
  const [typedName, setTypedName] = React.useState<string>();
  const authState = useAuth();
  const store = useStore();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const wishlists = store.user.wishlists;
  const receipts = store.user.receipts;

  React.useEffect(() => {
    if (store.user === null && isFocused && authState.isAnonymous) {
      dispatch({type: 'SET_LOGIN_MODAL', payload: true});
    } else if (store.user !== null && isFocused) {
      setSelectedNames(store.user.family);
      setTempSelectedNames(store.user.family);
      async () => {
        getCount();
        setTimeout(() => getLocalContacts(), 1000);
      };
    }
  }, [isFocused, store.user]);

  async function signOut() {
    auth().signOut();
  }

  // ============================== CONTACT METHODS ====================================

  function getCount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    }).then(() => {
      console.log('GOT PERMSSIONS');
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

  return (
    <View style={gs.fullBackground}>
      <View style={styles.headerView}>
        <Text style={styles.yourWishlistsText}>Your Account</Text>
        <TouchableOpacity
          style={styles.signOutTouchable}
          onPress={() => signOut()}>
          <Ion name="md-exit-outline" size={24} color="#0073FE" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', width: '100%'}}>
        <PersonalInfoCard
          editProfile={editProfile}
          setTypedName={setTypedName}
        />

        <View>
          <TouchableOpacity
            onPress={() => {
              if (
                editProfile &&
                typedName //&& typedName !== userName
              ) {
                setUserName(typedName);
                const userRef = firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid);
                userRef.set({
                  name: typedName,
                });
              }
              setEditProfile(!editProfile);
            }}>
            <Text style={styles.middleButtonText}>
              {editProfile ? 'Save Profile' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.middleButtonText, gs.bgGreen]}>
              Payment Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomTabsCard
        currentBottomTabIndex={currentBottomTabIndex}
        setCurrentBottomTabIndex={setCurrentBottomTabIndex}>
        <BottomTabsContent
          currentBottomTabIndex={currentBottomTabIndex}
          contactsLoading={contactsLoading}
          setContactModal={setContactModal}
          selectedNames={selectedNames}
          wishlists={wishlists}
          receipts={receipts}
        />
      </BottomTabsCard>
      <ContactsModal
        initialContactState={initialContactState}
        contactModal={contactModal}
        setContactModal={setContactModal}
        setContactsLoading={setContactsLoading}
        searchContacts={searchContacts}
        selectedNames={selectedNames}
        tempSelectedNames={tempSelectedNames}
        pushContactsFirebase={pushContactsFirebase}
        filteredContactNames={filteredContactNames}
        logItem={logItem}
      />
    </View>
  );
}

const styles = {
  yourWishlistsText: {
    ...gs.header,
    ...gs.flex1,
    margin: 0,
  },
  headerView: {
    ...gs.aStretch,
    ...gs.flexRow,
    ...gs.margin20,
    ...gs.width100,
    ...gs.bgWhite,
  },
  middleButtonText: {
    fontSize: 20,
    height: 60,
    width: '90%' as '90%',
    paddingVertical: 15,
    ...gs.aSelfCenter,
    ...gs.bgBlue,
    ...gs.bold,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.taCenter,
    ...gs.white,
  },
  signOutText: {
    fontSize: 18,
    textAlign: 'right' as 'right',
    paddingVertical: 5,
    ...gs.aStretch,
    // ...gs.blue,
    ...gs.flex1,
  },
  signOutTouchable: {
    ...gs.aStretch,
  },
};
