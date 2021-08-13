import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

function SelectableItem(props) {
  const [isSelected, setIsSelected] = React.useState(props.initialState);

  async function selectItem() {
    setIsSelected(!isSelected);
    props.logItem(props.name, isSelected);
  }

  return (
    <TouchableOpacity
      onPress={selectItem}
      style={[
        styles.contactSelect,
        isSelected
          ? {backgroundColor: 'grey'}
          : {backgroundColor: 'transparent'},
      ]}>
      <Text style={styles.title}>{props.name}</Text>
    </TouchableOpacity>
  );
}

export default SelectableItem;

const styles = StyleSheet.create({
  contactSelect: {
    marginTop: 15,
    height: 40,
    width: 250,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    alignSelf: 'center',
  },
});
