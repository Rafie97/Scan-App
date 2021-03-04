import React, {Component} from 'react';

import {View, Text, StyleSheet, Image} from 'react-native';

type TileProps = {
  imageSource?: string;
  name: string;
};

const FamilyTile = (props: TileProps) => {
  const [sauce, setSauce] = React.useState();

  React.useEffect(() => {
    if (props.imageSource || props.imageSource === '') {
      // setSauce(require('../../res/' + props.imageSource));
    } else {
      // setSauce(require('../../res/default_profile.jpg'));
    }
  });

  return (
    <View
      style={{
        height: 130,
        width: 100,
        marginLeft: 10,
        alignItems: 'flex-end',
      }}>
      <Image
        source={require('../../res/default_profile.jpg')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          borderColor: '#dddddd',
          borderWidth: 2,
          marginLeft: 10,
        }}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'center'}}>
        <Text style={{fontFamily: 'Segoe UI'}}>{props.name}</Text>
      </View>
    </View>
  );
};

export default FamilyTile;
