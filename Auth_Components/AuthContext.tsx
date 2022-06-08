import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Text, View} from 'react-native';

const AuthContext = React.createContext<FirebaseAuthTypes.User | undefined>(
  undefined,
);
const useAuth = () => React.useContext(AuthContext);
export default useAuth;

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(auth().currentUser);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      setPending(false);
    });
    if (currentUser) {
      setPending(false);
    }
  }, [currentUser]);

  if (pending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
