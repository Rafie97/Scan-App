import React from 'react';
import {View, Image, Text, TextInput} from 'react-native';
import Ion from 'react-native-vector-icons/Ionicons';
import FontAwe from 'react-native-vector-icons/FontAwesome';
import gs from '../../../Styles/globalStyles';
import useAuth from '../../../Auth_Components/AuthContext';

type PersonalInfoProps = {
  editProfile: boolean;
  setTypedName: (name: string) => void;
};

export default function PersonalInfoCard({
  editProfile,
  setTypedName,
}: PersonalInfoProps) {
  const userName = useAuth().currentUser.name;
  return (
    <View style={styles.personalInfoCard}>
      <Image
        source={require('../../../res/default_profile.jpg')}
        style={styles.defaultProfileImage}
      />
      <View style={{flexDirection: 'column'}}>
        {editProfile ? (
          <TextInput
            placeholder="Name"
            style={{fontSize: 18, borderWidth: 1, marginBottom: 8}}
            onChangeText={val => setTypedName(val)}
          />
        ) : (
          <Text
            style={[
              styles.personalInfoText,
              {fontWeight: 'bold', marginTop: 15, marginBottom: 20},
            ]}>
            {userName}
          </Text>
        )}

        <Text style={styles.personalInfoText}>
          <FontAwe name="phone" size={18} color="#0073FE" />
          {'   '}
          512.363.8986
        </Text>

        <Text style={styles.personalInfoText}>
          <Ion name="location-sharp" size={18} color="#0073FE" />
          {'  '}
          H-E-B
        </Text>
      </View>
    </View>
  );
}

const styles = {
  defaultProfileImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
    borderColor: '#0073FE',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  personalInfoCard: {
    width: '90%' as '90%',
    marginBottom: 10,
    paddingVertical: 10,
    ...gs.aSelfCenter,
    ...gs.bgWhite,
    ...gs.flexRow,
    ...gs.radius10,
    ...gs.shadow,
  },
  personalInfoText: {
    marginVertical: 5,
    fontSize: 18,
  },
};
