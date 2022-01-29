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
  return (
    <Modal
      visible={reviewModal}
      onRequestClose={() => setReviewModal(false)}
      transparent
      animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Write Review</Text>
          <Rating
            // defaultRating={props.rating || 0.01}
            onFinishRating={rating => {
              // setRating(rating);
            }}
            showRating={false}
          />
          <TextInput
            textAlign="left"
            textAlignVertical="top"
            multiline
            style={styles.reviewInput}
            placeholder="This was amazing!"
          />
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
    minHeight: 300,
    maxHeight: '50%',
    width: 300,
    ...gs.aCenter,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.padding20,
    ...gs.radius10,
    ...gs.shadow,
  },

  reviewInput: {
    height: 180,
    width: 250,
    backgroundColor: '#f1f1f1' as '#f1f1f1',
    padding: 10,
    ...gs.margin10,
  },
};
