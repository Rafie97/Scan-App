import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  Animated,
  FlatList,
} from 'react-native';

const MapBubble = props => {
  const [left, setLeft] = useState(null);
  const [top, setTop] = useState(null);

  useEffect(() => {
    setLeft(props.location.coordinates.xPos);
    setTop(props.location.coordinates.yPos);

    console.log(left, top);
  }, [
    props.location.coordinates.xPos,
    props.location.coordinates.yPos,
    left,
    top,
  ]);

  const styles = StyleSheet.create({
    circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'black',
      left: left,
      top: top,
    },
  });

  return <View style={styles.circle} />;
};

export default MapBubble;
