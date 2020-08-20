import React, {Component} from 'react';
import AppNavigation from './Navigation/AppNavigation';
import AuthNavigation from './Navigation/AuthNavigation';
import { createStackNavigator} from '@react-navigation/stack';
import BigMoney from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import {AuthProvider} from './Auth_Components/AuthContext';

console.disableYellowBox=true;

const OuterNavigator = createStackNavigator()

class App extends Component {
  
  render() {
    return (
      <AuthProvider>
        <NavigationContainer>
          <OuterNavigator.Navigator initialRouteName="App" headerMode="none">
            <OuterNavigator.Screen name="Auth" component={AuthNavigation}/>
            <OuterNavigator.Screen name="App" component={AppNavigation}/>
          </OuterNavigator.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
  }
}


export default App;
