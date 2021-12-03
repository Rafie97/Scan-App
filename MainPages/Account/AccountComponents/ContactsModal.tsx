import React from 'react';
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import SelectableItem from '../../../Components/SelectableItem';
import gs from '../../../Styles/globalStyles';

export default function ContactsModal({
  initialContactState,
  contactModal,
  setContactModal,
  setContactsLoading,
  searchContacts,
  selectedNames,
  tempSelectedNames,
  pushContactsFirebase,
  filteredContactNames,
  logItem,
}) {
  const renderItem = ({item}) => (
    <SelectableItem
      name={item}
      logItem={logItem}
      initialState={initialContactState(item)}
    />
  );
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={contactModal}
      onRequestClose={() => setContactModal(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Which contacts would you like to add?
          </Text>
          <TextInput
            placeholder="Search contacts by name"
            onChangeText={val => searchContacts(val)}
          />

          <FlatList
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            data={filteredContactNames}
            initialNumToRender={100}
            renderItem={renderItem}
          />

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                setContactModal(false);
                setContactsLoading(false);
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            {selectedNames.length === 0 && tempSelectedNames.length === 0 ? (
              <></>
            ) : (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={pushContactsFirebase}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  centeredView: {
    ...gs.flex1,
    ...gs.aCenter,
    ...gs.jCenter,
  },
  modalView: {
    padding: 35,
    ...gs.aCenter,
    ...gs.bgWhite,
    ...gs.radius10,
    ...gs.shadow,
  },
  modalText: {
    marginBottom: 15,
    ...gs.taCenter,
  },
  buttonContainer: {
    width: 80,
    height: 40,
    ...gs.bgBlue,
    ...gs.jCenter,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },

  buttonText: {
    fontSize: 18,
    ...gs.aSelfCenter,
    ...gs.white,
  },
};
