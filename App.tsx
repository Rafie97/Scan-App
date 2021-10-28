import React, {Component} from 'react';
import AppNavigation from './Navigation/AppNavigation';
import AuthNavigation from './Navigation/AuthNavigation';

import BigMoney from './app.json';
import {AuthProvider} from './Auth_Components/AuthContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import config from './hiddenConfig/config';
import firestore, {firebase} from '@react-native-firebase/firestore';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Font5Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Platform} from 'react-native';

MatIcon.loadFont();
AntIcon.loadFont();
Font5Icon.loadFont();
IonIcon.loadFont();
EvilIcons.loadFont();

console.disableYellowBox = true;

const OuterNavigator = createStackNavigator();

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    if (!firebase.apps.length || Platform.OS === 'ios') {
      firebase.initializeApp(config);
    }
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <OuterNavigator.Navigator headerMode="none">
          {isSignedIn ? (
            <OuterNavigator.Screen name="App" component={AppNavigation} />
          ) : (
            <OuterNavigator.Screen name="Auth" component={AuthNavigation} />
          )}
        </OuterNavigator.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
