import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import gs from '../../../../Styles/globalStyles';
import Ion from 'react-native-vector-icons/Ionicons';
import FontAwe from 'react-native-vector-icons/FontAwesome';
import FontAwe5 from 'react-native-vector-icons/FontAwesome5';

type BottomTabsCardProps = {
  currentBottomTabIndex: number;
  setCurrentBottomTabIndex: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
};

export default function BottomTabsCard({
  currentBottomTabIndex,
  setCurrentBottomTabIndex,
  children,
}: BottomTabsCardProps) {
  return (
    <View style={styles.fullBottomCard}>
      <View
        style={{
          width: '100%',
        }}>
        <View style={{flexDirection: 'row', width: '100%'}}>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(0);
            }}
            style={{flex: 1, borderRightWidth: 2}}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'stretch',
                textAlign: 'center',
                fontWeight: currentBottomTabIndex === 0 ? 'bold' : 'normal',
              }}>
              <Ion name="people" color="#0073FE" size={20} /> Family
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(1);
            }}
            style={{flex: 1, borderRightWidth: 2}}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'stretch',
                textAlign: 'center',
                fontWeight: currentBottomTabIndex === 1 ? 'bold' : 'normal',
              }}>
              <FontAwe name="heart" color="#0073FE" size={18} /> Wishlists
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(2);
            }}
            style={{flex: 1}}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'stretch',
                textAlign: 'center',
                fontWeight: currentBottomTabIndex === 2 ? 'bold' : 'normal',
              }}>
              <FontAwe5 name="receipt" color="#0073FE" size={18} /> Receipts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          padding: 20,
        }}>
        {children}
      </View>
    </View>
  );
}

const styles = {
  fullBottomCard: {
    width: '90%' as '90%',
    paddingTop: 10,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },
};
