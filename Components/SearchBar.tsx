import React from 'react';
import {TextInput, StyleSheet, View, Keyboard} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Ion from 'react-native-vector-icons/Ionicons';

type PropTypes = {
  searchItems: (val) => {};
  setSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SearchBar(props: PropTypes) {
  return (
    <TouchableWithoutFeedback
      style={{height: '100%'}}
      onPress={Keyboard.dismiss}>
      <View style={styles.searchBarView}>
        <Ion name="search-circle" size={40} color="white" />
        <TextInput
          style={styles.searchInput}
          onChangeText={val => {
            props.searchItems(val);
          }}
          onFocus={() => props.setSearchFocused(true)}
          onBlur={() => props.setSearchFocused(false)}
          placeholderTextColor="white"
          placeholder="Search this store"
          returnKeyType="done"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchBarView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: '65%',
    borderRadius: 10,
    margin: 20,
    backgroundColor: '#0073FE',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },

  searchInput: {
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
});
