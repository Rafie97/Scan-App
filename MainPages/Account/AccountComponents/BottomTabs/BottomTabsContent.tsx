import React, {Dispatch, SetStateAction} from 'react';
import {TouchableOpacity, View, Text, FlatList} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import FamilyTile, {
  ReceiptTile,
  WishlistTile,
} from '../../../../Components/Tiles';
import FontAwe from 'react-native-vector-icons/FontAwesome';
import Receipt from '../../../../Models/CartModels/Receipt';
import gs from '../../../../Styles/globalStyles';
import {Wishlist} from '../../../../Models/UserModels/User';

type BottomTabsContentProps = {
  currentBottomTabIndex: number;
  contactsLoading: boolean;
  setContactModal: Dispatch<SetStateAction<boolean>>;
  selectedNames: string[];
  wishlists: Wishlist[];
  receipts: Receipt[];
};

export default function BottomTabsContent({
  currentBottomTabIndex,
  contactsLoading,
  setContactModal,
  selectedNames,
  wishlists,
  receipts,
}: BottomTabsContentProps) {
  const [selected, setSelected] = React.useState('');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  if (currentBottomTabIndex === 0) {
    return (
      <View>
        {contactsLoading ? (
          <View style={styles.loadingView}>
            <Text style={{color: 'white'}}>Loading...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.tabView}
            onPress={() => setContactModal(true)}>
            <Text style={[gs.blue, {fontSize: 18}]}>
              <FontAwe name="plus-square" size={18} color="#0073FE" /> Add
              Family
            </Text>
          </TouchableOpacity>
        )}
        {selectedNames ? (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            data={selectedNames}
            horizontal={true}
            renderItem={({item}) => <FamilyTile name={item} />}
          />
        ) : (
          <View style={styles.noFamView}>
            <Text style={styles.noFamText}>There is no Family to show</Text>
          </View>
        )}
      </View>
    );
  }

  if (currentBottomTabIndex === 1) {
    return (
      <View>
        <TouchableOpacity style={styles.tabView}>
          <Text style={{color: '#0073FE', fontSize: 18}}>
            <FontAwe name="plus-square" size={18} color="#0073FE" /> Add
            Wishlist
          </Text>
        </TouchableOpacity>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          data={wishlists}
          horizontal={true}
          renderItem={({item}) => <WishlistTile name={item.id} />}
        />
      </View>
    );
  }

  if (currentBottomTabIndex === 2 && receipts.length > 0) {
    return (
      <View>
        <View style={styles.receiptView}>
          <View style={styles.sortBarView}>
            <Text style={{fontSize: 16}}>Sort: </Text>
            <DropDownPicker
              items={[
                {label: 'Date', value: 'date'},
                {label: 'Store Name', value: 'store'},
              ]}
              open={dropdownOpen}
              setOpen={op => setDropdownOpen(op)}
              value={selected}
              setValue={setSelected}
              style={{height: 35}}
              containerStyle={{width: 160}}
            />
          </View>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          data={receipts}
          horizontal={true}
          renderItem={({item}) => <ReceiptTile receipt={item} />}
        />
      </View>
    );
  }
}

const styles = {
  loadingView: {
    height: 30,
    width: 100,
    margin: 10,
    ...gs.aCenter,
    ...gs.bgBlue,
    ...gs.jCenter,
  },
  tabView: {
    height: 30,
    width: '40%' as '40%',
    marginBottom: 20,
    ...gs.aCenter,
    ...gs.jCenter,
  },
  noFamView: {
    ...gs.aCenter,
    ...gs.jCenter,
    ...gs.width100,
  },
  noFamText: {
    fontSize: 20,
    paddingTop: 40,
    height: 130,
    ...gs.blue,
    ...gs.bold,
    ...gs.taCenter,
    ...gs.width100,
  },
  receiptView: {
    height: 30,
    marginBottom: 20,
    marginLeft: 10,
    ...gs.aCenter,
    ...gs.flexRow,
    ...gs.jCenter,
    ...gs.width100,
  },
  sortBarView: {
    ...gs.aCenter,
    ...gs.flexRow,
    ...gs.width100,
  },
};
