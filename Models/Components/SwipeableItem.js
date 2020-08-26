import React from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, Animated, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';



const { width } = Dimensions.get('window');

export default class SwipeableItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this.gestureDelay = 15;
        this.scrollViewEnabled = true;

        const position = new Animated.ValueXY();
        this.state = { position};

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < -15) {
                    this.setScrollViewEnabled(false);
                    let newX = gestureState.dx + this.gestureDelay;
                    position.setValue({ x: newX, y: 0 });
                    
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -50) {
                    Animated.timing(this.state.position, {
                        toValue: { x: -50, y: 0 },
                        duration: 150
                    }).start(() => {
                        this.setScrollViewEnabled(true);
                    });
                }
                if (gestureState.dx > -50) {
                    Animated.timing(this.state.position, {
                        toValue: { x: 0, y: 0 },
                        duration: 150
                    }).start(() => {
                        this.setScrollViewEnabled(true);
                    })
                }
            },
        });

        
   
        this.panResponder = panResponder;
        this.navToItem = this.navToItem.bind(this);

    }


    setScrollViewEnabled(enabled) {
        if (this.scrollViewEnabled !== enabled) {
            this.props.setScrollEnabled(enabled);
            this.scrollViewEnabled = enabled;
        }
    }

    navToItem(){
        this.props.navigation.navigate(this.props.sourcePage, {screen: this.props.sourcePage + "ItemPage" , params:{itemIDCallback:this.props.item }})
    }

    render() {
        
        return (
            <Animated.View style={{ flexDirection: "row", justifyContent: "flex-end" }}>

                <View style={{ alignSelf: "center", paddingBottom: 20, position: "absolute" }}>
                    <TouchableOpacity onPress= {()=>this.props.deleteItem(this.props.item.docID)} >
                        <Animated.View style={{ backgroundColor: "#D93F12", width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth:2 }}>
                            <EvilIcons name="trash" size={30} color="black"></EvilIcons>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <Animated.View style={{ left: this.state.position.x }} {...this.panResponder.panHandlers}>
                    <TouchableOpacity style={styles.itemBubble} onPress = {this.navToItem} activeOpacity={0.5}>
                        <Image source={{ uri: this.props.item.imageLink }} style={styles.itemImage}></Image>
                        <Text style={styles.itemLabel}>{this.props.item.name}</Text>
                        <Text style={styles.itemPrice}>${this.props.item.price}</Text>
                    </TouchableOpacity>
                </Animated.View>

            </Animated.View>

        );
    }
}



const styles = new StyleSheet.create({
    itemBubble:
    {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: "row",
        width: 300,
        height: 70,
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
        borderWidth: 1,
        borderColor:"grey"
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