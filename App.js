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

console.disableYellowBox = true;

const OuterNavigator = createStackNavigator();

class App extends Component {
  constructor(props) {
    firebase.initializeApp(config);
    super(props);
    this.state = {
      isSignedIn: false,
    };
  }

  componentDidMount() {
    if (!firebase.apps.length) {
      console.log('check passed');
      firebase.initializeApp(config);
    } else {
      console.log('check failed');
    }
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({isSignedIn: true});
      } else {
        this.setState({isSignedIn: false});
      }
    });
  }

  render() {
    return (
      <AuthProvider>
        <NavigationContainer>
          <OuterNavigator.Navigator headerMode="none">
            {this.state.isSignedIn ? (
              <OuterNavigator.Screen name="App" component={AppNavigation} />
            ) : (
              <OuterNavigator.Screen name="Auth" component={AuthNavigation} />
            )}
          </OuterNavigator.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
  }
}

export default App;
