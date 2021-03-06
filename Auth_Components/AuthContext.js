import React, {useEffect, useState} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {Text} from 'react-native'


export const AuthContext = React.createContext();

export const AuthProvider = ({children})=>{

    const [currentUser, setCurrentUser] = useState(auth().currentUser);
    const [pending, setPending]= useState(true);

    useEffect(()=>{
        auth().onAuthStateChanged((user)=>{
            setCurrentUser(user);
            setPending(false);
        });

        if(currentUser){
            setPending(false);
        }
        
    }, []);

    if(pending){
        return <Text>Loading...</Text>
    }

    return(
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    );

}
