import React, { Component } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainLogin from '../LoginPages/MainLogin';
import {firebase} from '@react-native-firebase/firestore';



const AuthNav= createStackNavigator()

class AuthNavigation extends Component{


    render(){
        return(
            <AuthNav.Navigator initialRouteName="Login" headerMode="none">
                <AuthNav.Screen name="Login" component={MainLogin}/>
            </AuthNav.Navigator>
        )
    }
}

export default AuthNavigation;