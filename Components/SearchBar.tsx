import React from 'react';
import {TextInput, StyleSheet, View, Keyboard} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Ion from 'react-native-vector-icons/Ionicons';
import gs from '../Styles/globalStyles';

type PropTypes = {
  searchItems: (val) => {};
  setSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SearchBar(props: PropTypes) {
  const inputRef = React.useRef(null);

  return (
    <TouchableWithoutFeedback
      style={{height: '100%'}}
      onPress={Keyboard.dismiss}>
      <View style={[styles.searchBarView]}>
        <Ion name="search-circle" size={40} color="white" />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, gs.taCenter]}
          onChangeText={val => {
            props.searchItems(val);
          }}
          onFocus={() => {
            props.setSearchFocused(true);
          }}
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
    width: '65%',
    alignSelf: 'center',
    ...gs.aCenter,
    ...gs.aSelfCenter,
    ...gs.bgBlue,
    ...gs.flexRow,
    ...gs.jCenter,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },

  searchInput: {
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
  },
});
