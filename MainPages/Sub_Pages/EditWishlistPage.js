import React, {Component} from 'react';
import {Button, Icon, LinearGradient} from 'react-native-elements';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';
import Item from '../../Models/Item';
import SwipeableItem from '../../Models/Components/SwipeableItem';
import auth from '@react-native-firebase/auth';
import Ionicon from 'react-native-vector-icons/Ionicons';

class EditWishlistPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      isScrollEnabled: true,
      routeListName: this.props.route.params.listNameCallback,
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.getItems = this.getItems.bind(this);
    this.setScrollEnabled = this.setScrollEnabled.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  async getItems() {
    const userID = auth().currentUser.uid;
    const wishRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(this.state.routeListName)
      .collection('items');

    await wishRef.onSnapshot(snap => {
      this.setState({listItems: []});
      snap.forEach(doc => {
        const item = new Item(doc);
        this.setState({listItems: [...this.state.listItems, item]});
      });
    });
  }

  deleteItem(itemID) {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(this.state.routeListName)
      .collection('items');

    cartRef
      .doc(itemID)
      .delete()
      .then(() => {
        console.log('Successfully deleted from wishlist');
      })
      .catch(err => {
        console.log('Error removing from list: ', err);
      });
  }

  setScrollEnabled(enable) {
    this.setState({isScrollEnabled: enable});
  }

  renderItem = ({item}) => (
    <SwipeableItem
      item={item}
      setScrollEnabled={enable => this.setScrollEnabled(enable)}
      deleteItem={this.deleteItem}
      sourcePage="Account"
      navigation={this.props.navigation}
    />
  );

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ImageBackground
        style={styles.fullBackground}
        source={require('../../res/grad_3.png')}>
        <View style={styles.backButtonView}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => navigate('AccountPage')}>
            <Ionicon
              name="arrow-back-circle-outline"
              size={50}
              style={{marginLeft: 10, marginTop: 5}}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.ListNameText}>{this.state.routeListName}</Text>

        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <View style={styles.wishlistGroupView}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={this.state.listItems}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default EditWishlistPage;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wishlistGroupView: {
    padding: 30,
    paddingTop: 20,
  },
  wishlistButton: {
    opacity: 100,
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 20,
    flex: 1,
  },
  backButtonView: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 150,
    alignSelf: 'flex-start',
  },
  gridContainer: {
    flex: 1,
  },
  ListNameText: {
    fontSize: 40,
    textAlign: 'center',
    paddingTop: 60,
  },
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
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 10,
    borderWidth: 10,
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
});
