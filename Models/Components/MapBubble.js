import React, {  useState, useEffect } from 'react';

import { StyleSheet, View, Text, TextInput, ImageBackground, Image, Animated, FlatList } from 'react-native';


const MapBubble = (props) => {

    const [left, setLeft] = useState(null);
    const [top, setTop] = useState(null);

    useEffect(()=>{
        setLeft(props.location.xPos);
        setTop(props.location.yPos);
    })

    const styles = StyleSheet.create({
        circle: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'black',
            
        }
    });

    
    return(
        <View style={styles.circle}  ></View>
    )

    
    
}


export default MapBubble;