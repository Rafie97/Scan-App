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

const {width} = Dimensions.get('window');

function SwipeableItem(props) {
  const [scrollViewEnabled, setScrollEnabled] = React.useState(true);
  const position = React.useRef(new Animated.ValueXY()).current;

  const gestureDelay = 10;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -15) {
          setScrollViewEnabled(false);
          let newX = gestureState.dx + gestureDelay;
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.timing(position, {
            toValue: {x: -50, y: 0},
            duration: 150,
          }).start(() => {
            setScrollViewEnabled(true);
          });
        }
        if (gestureState.dx > -50) {
          Animated.timing(position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
            setScrollViewEnabled(true);
          });
        }
      },
    }),
  ).current;

  function setScrollViewEnabled(enabled) {
    if (scrollViewEnabled !== enabled) {
      props.setScrollEnabled(enabled);
      setScrollEnabled(enabled);
    }
  }

  function navToItem() {
    props.navigation.navigate(props.sourcePage, {
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
    <View>
      <Animated.View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            alignSelf: 'center',
            paddingBottom: 20,
            position: 'absolute',
            right: -5,
          }}>
          <TouchableOpacity onPress={() => props.deleteItem(props.item.docID)}>
            <Animated.View
              style={{
                backgroundColor:
                  position.x < -15 ? 'rgba(217, 63, 18, 0.5)' : '#D93F12', //'#D93F12'
                width: 50,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                elevation: 20,

                // borderWidth: 2,
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
          <View style={styles.itemBubble}>
            <Image
              source={{uri: props.item.imageLink}}
              style={styles.itemImage}
            />
            <TouchableOpacity
              onPress={navToItem}
              activeOpacity={0.5}
              style={{
                marginVertical: 10,
                width: '40%',
                height: '75%',
                justifyContent: 'center',
              }}>
              <Text style={styles.itemLabel}>{props.item.name}</Text>
              <Text style={styles.itemPrice}>
                ${props.item.price * props.item.quantity}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                right: 0,
                marginRight: 20,
              }}>
              <View style={{flexDirection: 'column', marginBottom: 5}}>
                <TouchableOpacity onPress={() => incrementQuantity(1)}>
                  <EvilIcons name="plus" size={35} color="#0073FE" />
                </TouchableOpacity>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginl: 10,
                    fontWeight: 'bold',
                    width: 20,
                  }}>
                  x{props.item.quantity}
                </Text>
                <TouchableOpacity onPress={() => incrementQuantity(-1)}>
                  <EvilIcons name="minus" size={35} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default SwipeableItem;

const styles = StyleSheet.create({
  itemBubble: {
    backgroundColor: 'white',
    // borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    flexDirection: 'row',
    width: 350,
    height: 100,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 9.11,
    elevation: 5,
  },
  itemImage: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 10,
    // borderWidth: 1,
    borderColor: 'grey',
  },
  itemLabel: {
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    //fontFamily: 'Roboto',
  },
  itemPrice: {
    marginLeft: 20,

    fontSize: 16,
  },
});
