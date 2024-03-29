import React, {Component} from 'react';
import AppNavigation, {NavContext} from './Navigation/AppNavigation';
import AuthNavigation from './Navigation/AuthNavigation';
import {AuthProvider} from './Auth_Components/AuthContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import config from './hiddenConfig/config';
import {firebase} from '@react-native-firebase/firestore';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Font5Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Platform} from 'react-native';
import StoreProvider from './Reducers/store';

MatIcon.loadFont();
AntIcon.loadFont();
Font5Icon.loadFont();
IonIcon.loadFont();
EvilIcons.loadFont();

console.disableYellowBox = true;

const OuterNavigator = createStackNavigator();

if (Platform.OS === 'ios' || !firebase.apps.length) {
  firebase.initializeApp(config);
}

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'ios' || !firebase.apps.length) {
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
    <NavigationContainer>
      <AuthProvider>
        <StoreProvider>
          <OuterNavigator.Navigator headerMode="none">
            {isSignedIn ? (
              <OuterNavigator.Screen name="App" component={AppNavigation} />
            ) : (
              <OuterNavigator.Screen name="Auth" component={AuthNavigation} />
            )}
          </OuterNavigator.Navigator>
        </StoreProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;
