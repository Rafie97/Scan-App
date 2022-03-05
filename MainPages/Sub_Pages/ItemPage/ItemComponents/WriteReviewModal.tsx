import React from 'react';
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {AirbnbRating as Rating} from 'react-native-elements';

import gs from '../../../../Styles/globalStyles';

type Props = {
  reviewModal: boolean;
  setReviewModal: Function;
};

export default function WriteReviewModal({reviewModal, setReviewModal}: Props) {
  function setRating(rating: number) {}

  return (
    <Modal
      visible={reviewModal}
      onRequestClose={() => setReviewModal(false)}
      transparent
      animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.tellUsText}>Tell us what you think</Text>
          <Rating
            // defaultRating={props.rating || 0.01}
            onFinishRating={rating => {
              // setRating(rating);
            }}
            starStyle={styles.starStyle}
            showRating={false}
          />
          <TextInput
            textAlign="left"
            textAlignVertical="top"
            multiline
            style={styles.reviewInput}
            placeholder="This was amazing!"
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setReviewModal(false);
            }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
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
    height: 380,
    width: 300,
    ...gs.aCenter,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.padding20,
    ...gs.radius10,
    ...gs.shadow,
  },

  tellUsText: {
    marginBottom: 10,
  },

  starStyle: {
    tintColor: '#fde233' as '#fde233',
  },

  reviewInput: {
    height: 180,
    width: 250,
    backgroundColor: '#f1f1f1' as '#f1f1f1',
    padding: 10,
    marginTop: 20,
    ...gs.margin10,
  },

  buttonContainer: {
    width: 80,
    height: 40,
    ...gs.bgBlue,
    ...gs.jCenter,
    ...gs.margin10,
    ...gs.radius10,
    ...gs.shadow,
  },

  buttonText: {
    fontSize: 18,
    ...gs.aSelfCenter,
    ...gs.white,
  },
};
