import React from 'react'
import Animated, { useCode, cond, eq, not, set, add, abs, multiply, divide } from 'react-native-reanimated';
import { PanGestureHandler, State, TouchableOpacity } from 'react-native-gesture-handler';
import { usePanGestureHandler, useValue, timing, snapPoint, minus, clamp, min } from 'react-native-redash';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const snapPoints = [-20, 0];

const SwipeableItem = ({ item }) => {

    const {
        gestureHandler,
        translation,
        velocity,
        state,
    } = usePanGestureHandler();

    const translateX = useValue(0);
    const offsetX = useValue(0);
    const snapTo = snapPoint(translateX, velocity.x, snapPoints);

    useCode(() => [
        cond(eq(state, State.ACTIVE), set(translateX, add(offsetX, clamp(translation.x, -9999, minus(offsetX))))),
        cond(eq(state, State.END), [
            set(translateX, timing({ from: translateX, to: snapTo })),
            //set(offsetX, translateX)
        ])
    ], []);


    return (
        <Animated.View style={{flexDirection:"row"}}>

            <PanGestureHandler {...gestureHandler}>
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <View style={styles.itemBubble} >
                        <Image source={{ uri: item.imageLink }} style={styles.itemImage}></Image>
                        <Text style={styles.itemLabel}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler >

            <View style={{alignSelf:"center", marginBottom: 20, justifyContent:"flex-end"}}>
                <TouchableOpacity>
                    <DeleteButton x = {abs(translateX)}/>
                </TouchableOpacity>
            </View>

        </Animated.View>

        
    )
}

export default SwipeableItem;

const DeleteButton = ({x}) => {
    const size = min(multiply(4,x),40);
    return (
        <Animated.View style = {{backgroundColor:"#D93F12",height:size, width:size, alignItems:"center", justifyContent:"center", transform:[], borderRadius:10, borderWidth:divide(size,20)}}>
            <EvilIcons name="trash" size={30} color="black"></EvilIcons>
        </Animated.View>
    )
}

const styles = new StyleSheet.create({
    itemBubble:
    {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: "row",
        width: 300,
        height: 60,
        marginBottom: 20,
    },
    itemImage:
    {
        alignSelf: "center",
        width: 45,
        height: 45,
        marginLeft: 10,
        marginRight: 0,
        borderRadius: 10,
        borderWidth: 10
    },
    itemLabel:
    {
        alignSelf: "center",
        marginLeft: 15,
        fontSize: 16,
        fontFamily: 'Segoe UI'
    },
    itemPrice: {
        alignSelf: 'center',
        textAlign: 'right',
        marginLeft: 'auto',
        marginRight: 10
    },
})