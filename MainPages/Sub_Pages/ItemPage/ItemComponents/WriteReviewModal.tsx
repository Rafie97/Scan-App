import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import useAuth from '../../../../Auth_Components/AuthContext';
import gs from '../../../../Styles/globalStyles';
import {AirbnbRating as Rating} from 'react-native-ratings';

type Props = {
  itemId: string;
  reviewModal: boolean;
  setReviewModal: Function;
};

export default function WriteReviewModal({
  itemId,
  reviewModal,
  setReviewModal,
}: Props) {
  const user = useAuth();
  const [reviewNumber, setReviewNumber] = React.useState<number>(0);
  const [reviewText, setReviewText] = React.useState<string>('');

  function setRating(rating: number, reviewText: string) {
    const review = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items')
      .doc(itemId)
      .collection('reviews')
      .where('reviewerId', '==', user.uid)
      .get();
    review.then(snap => {
      if (snap.docs.length) {
        firestore()
          .collection('stores')
          .doc('HEB')
          .collection('items')
          .doc(itemId)
          .collection('reviews')
          .doc(snap.docs[0].id)
          .update({
            rating: rating,
            reviewText: reviewText,
          });
      } else {
        firestore()
          .collection('stores')
          .doc('HEB')
          .collection('items')
          .doc(itemId)
          .collection('reviews')
          .add({
            rating: rating,
            reviewerId: user.uid,
            reviewText: reviewText,
          });
      }
      setReviewNumber(rating);
    });
  }

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
            onFinishRating={rating => {
              setRating(rating, reviewText);
            }}
            showRating={false}
            reviewColor="#0073fe"
          />
          <TextInput
            textAlign="left"
            textAlignVertical="top"
            multiline
            style={styles.reviewInput}
            placeholder="This was amazing!"
            onChangeText={text => setReviewText(text)}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setRating(reviewNumber, reviewText);
              setReviewModal(false);
            }}>
            <Text style={styles.buttonText}>Done</Text>
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
    backgroundColor: '#f18b0f' as '#f18b0f',
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
