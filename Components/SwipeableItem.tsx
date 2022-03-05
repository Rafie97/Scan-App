import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import gs from '../Styles/globalStyles';
import ItemBubble from './ItemBubble';
import {useNavigation} from '@react-navigation/native';
import Item from '../Models/ItemModels/Item';
import {CartItem} from '../Models/ItemModels/CartItem';

const {width} = Dimensions.get('window');

type Props = {
  item: CartItem;
  deleteItem: (itemID: string) => void;
  sourcePage: string;
  setScrollEnabled: (bool: boolean) => void;
};

function SwipeableItem({
  item,
  deleteItem,
  sourcePage,
  setScrollEnabled,
}: Props) {
  const position = React.useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation();
  const gestureDelay = 10;
  const displacement = 50;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -15) {
          setScrollEnabled(false);
          let newX = gestureState.dx + gestureDelay;
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -displacement) {
          //@ts-ignore
          Animated.timing(position, {
            toValue: {x: -displacement, y: 0},
            duration: 150,
          }).start(() => {
            setScrollEnabled(true);
          });
        }
        if (gestureState.dx > -displacement) {
          //@ts-ignore
          Animated.timing(position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
            setScrollEnabled(true);
          });
        }
      },
    }),
  ).current;

  function navToItem() {
    navigation.navigate(sourcePage, {
      initial: false,
      screen: sourcePage + 'ItemPage',
      params: {itemIDCallback: item, isRecipe: item.isRecipe},
    });
  }

  function incrementQuantity(increment) {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart')
      .doc(item.docID);

    if (increment === 1 && item.quantity < 99) {
      const newQuan = item.quantity + 1;
      cartRef.update({quantity: newQuan});
    }
    if (increment === -1 && item.quantity > 1) {
      const newQuan = item.quantity - 1;
      cartRef.update({quantity: newQuan});
    }
  }

  return (
    <Animated.View style={styles.mainView}>
      <View style={styles.deleteView}>
        <TouchableOpacity onPress={() => deleteItem(item.docID)}>
          <Animated.View style={styles.deleteButton}>
            <EvilIcons name="trash" size={30} color="black" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          left: position.x,
        }}
        {...panResponder.panHandlers}>
        <ItemBubble
          item={item}
          navToItem={navToItem}
          quantity={item.quantity}
          incrementQuantity={incrementQuantity}
          inCart={true}
        />
      </Animated.View>
    </Animated.View>
  );
}

export default SwipeableItem;

const styles = {
  mainView: {
    justifyContent: 'flex-end' as 'flex-end',
    position: 'relative' as 'relative',
    ...gs.flexRow,
  },
  deleteView: {
    right: -5,
    bottom: 10,
    ...gs.pAbsolute,
  },
  deleteButton: {
    backgroundColor: '#D93F12' as '#D93F12',
    width: 50,
    height: 80,
    ...gs.aCenter,
    ...gs.jCenter,
    ...gs.radius10,
  },
};
