import React, { Component } from 'react'

import { View, Text, StyleSheet, Image } from 'react-native'

class FamilyTile extends Component {

    render() {
        return (
            <View style={{ height: 130, width: 100, marginLeft: 10, alignItems:"flex-end" }}>
                <View style={{ height: 100, width: 100, marginLeft: 10, borderWidth: 1, borderColor: '#dddddd', borderRadius: 10, alignItems:"flex-end" }}>
                    <Image source={{uri:"https://randomuser.me/api/portraits/med/men/96.jpg"}} style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }} />
                </View>
                <View style={{ flex: 1, paddingTop: 10, alignSelf:"center"}}>
                    <Text style={{fontFamily:"Segoe UI"}}>{this.props.name}</Text>
                </View>
            </View>
        )
    }
}

export default FamilyTile;