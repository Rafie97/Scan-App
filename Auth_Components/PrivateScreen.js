import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AuthContext} from './AuthContext';
import { NavigationContainer } from '@react-navigation/native';

const PrivateRoute=({component:RouteComponent, ...rest}) =>{
    const {currentUser} = useContext(AuthContext);

    return(
        <OuterNavigator.Screen 
        {...rest} 
        render={routeProps=>!!currentUser ? (<RouteComponent {...routeProps}/>):(<Redirect to='/'/>)} />
    );
}

export default PrivateRoute