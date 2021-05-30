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
  Button,
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
import Ionicon from 'react-native-vector-icons/Ionicons';

class WishlistPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlists: [],
    };

    this.getLists = this.getLists.bind(this);
  }

  async componentDidMount() {
    this.getLists();
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ImageBackground
        source={require('../res/grad_3.png')}
        style={styles.fullBackground}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => navigate('AccountPage')}>
          <Ionicon
            name="arrow-back-circle-outline"
            size={50}
            style={{marginLeft: 10, marginTop: 5}}
          />
        </TouchableOpacity>
        <View style={styles.wishlistGroupView}>
          <FlatList
            data={this.state.wishlists}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigate('Account', {
                    screen: 'EditWishlistPage',
                    params: {listNameCallback: item},
                  })
                }>
                <View style={styles.wishlistSelect}>
                  <Text style={styles.title}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ImageBackground>
    );
  }

  renderItem = ({item}) => <SelectableItem name={item} />;

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
}

export default WishlistPage;

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
});
