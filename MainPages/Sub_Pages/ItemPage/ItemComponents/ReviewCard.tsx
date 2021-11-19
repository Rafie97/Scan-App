import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import gs from '../../../../Styles/globalStyles';

export default function ReviewCard({reviews}) {
  return (
    <View style={styles.reviewContainer}>
      <View style={[gs.flexRow, gs.width100]}>
        <Text style={styles.reviewHeader}>Reviews </Text>
        <View style={styles.avgReviewView}>
          <Text style={styles.avgReviewText}>4.0</Text>
          <Text style={styles.avg5}>/5</Text>
        </View>
      </View>
      <View style={styles.reviewBody}>
        {reviews &&
          reviews.map((review, index) => (
            <View key={index} style={styles.review}>
              <Text style={styles.reviewName}>{review.reviewer}</Text>
              <Text>{review.reviewText}</Text>
            </View>
          ))}
      </View>
      <TouchableOpacity style={styles.writeReviewButton}>
        <Text style={styles.reviewButtonText}>Write a Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  reviewContainer: {
    width: 300,
    height: 300,
    marginHorizontal: 20,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },

  reviewHeader: {
    width: '60%',
    ...gs.flex1,
    ...gs.subHeader,
  },

  avgReviewView: {
    ...gs.flexRow,
    ...gs.flex1,
    ...gs.aCenter,
  },
  avgReviewText: {
    fontSize: 30,
    fontWeight: 'bold' as 'bold',
    ...gs.flex1,
  },
  avg5: {
    fontSize: 15,
    fontWeight: 'bold' as 'bold',
    marginTop: 10,
    marginRight: 20,
    ...gs.flex1,
  },

  reviewBody: {},

  review: {
    ...gs.flexColumn,
    ...gs.margin20,
    ...gs.radius10,
  },

  reviewName: {
    fontWeight: 'bold' as 'bold',
  },

  writeReviewButton: {
    padding: 10,
    ...gs.aCenter,
    ...gs.bgBlue,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },
  reviewButtonText: {color: 'white'},
};
