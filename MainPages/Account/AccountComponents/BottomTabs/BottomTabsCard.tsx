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
      <View style={gs.width100}>
        <View style={[gs.width100, gs.flexRow]}>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(0);
            }}
            style={{...gs.flex1, borderRightWidth: 2}}>
            <Text
              style={[
                styles.tabText,
                {
                  fontWeight: currentBottomTabIndex === 0 ? 'bold' : 'normal',
                },
              ]}>
              <Ion name="people" color="#0073FE" size={20} /> Family
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(1);
            }}
            style={{...gs.flex1, borderRightWidth: 2}}>
            <Text
              style={[
                styles.tabText,
                {
                  fontWeight: currentBottomTabIndex === 1 ? 'bold' : 'normal',
                },
              ]}>
              <FontAwe name="heart" color="#0073FE" size={18} /> Wishlists
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentBottomTabIndex(2);
            }}
            style={gs.flex1}>
            <Text
              style={[
                styles.tabText,
                {
                  fontWeight: currentBottomTabIndex === 2 ? 'bold' : 'normal',
                },
              ]}>
              <FontAwe5 name="receipt" color="#0073FE" size={18} /> Receipts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.childContainer}>{children}</View>
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

  tabText: {
    fontSize: 20,
    ...gs.aStretch,
    ...gs.taCenter,
  },

  childContainer: {
    padding: 20,
    ...gs.flexColumn,
    ...gs.width100,
  },
};
