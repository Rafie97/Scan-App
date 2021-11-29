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

const {width} = Dimensions.get('window');

function SwipeableItem(props) {
  const position = React.useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation();

  const gestureDelay = 10;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -15) {
          // setScrollViewEnabled(false);
          let newX = gestureState.dx + gestureDelay;
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          //@ts-ignore
          Animated.timing(position, {
            toValue: {x: -50, y: 0},
            duration: 150,
          }).start(() => {
            // setScrollViewEnabled(true);
          });
        }
        if (gestureState.dx > -50) {
          //@ts-ignore
          Animated.timing(position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
            // setScrollViewEnabled(true);
          });
        }
      },
    }),
  ).current;

  function navToItem() {
    navigation.navigate(props.sourcePage, {
      screen: props.sourcePage + 'ItemPage',
      params: {itemIDCallback: props.item},
    });
  }

  function incrementQuantity(increment) {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart')
      .doc(props.item.docID);

    if (increment === 1 && props.item.quantity < 99) {
      const newQuan = props.item.quantity + 1;
      cartRef.update({quantity: newQuan});
    }
    if (increment === -1 && props.item.quantity > 1) {
      const newQuan = props.item.quantity - 1;
      cartRef.update({quantity: newQuan});
    }
  }

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'relative',
      }}>
      <View
        style={{
          // ...gs.aSelfCenter,
          position: 'absolute',
          right: 5,
          bottom: 10,
        }}>
        <TouchableOpacity onPress={() => props.deleteItem(props.item.docID)}>
          <Animated.View
            style={{
              backgroundColor:
                //@ts-ignore
                position.x < -15 ? 'rgba(217, 63, 18, 0.5)' : '#D93F12', //red
              width: 50,
              height: 80,
              ...gs.aCenter,
              ...gs.jCenter,
              ...gs.radius10,
            }}>
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
          item={props.item}
          navToItem={navToItem}
          quantity={props.item.quantity}
          incrementQuantity={incrementQuantity}
          inCart={true}
        />
      </Animated.View>
    </Animated.View>
  );
}

export default SwipeableItem;
