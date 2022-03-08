import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import gs from '../../../../Styles/globalStyles';
import Ant from 'react-native-vector-icons/AntDesign';
import WriteReviewModal from './WriteReviewModal';
import FontAwe5 from 'react-native-vector-icons/FontAwesome5';
import {Review} from '../../../../Models/ItemModels/Review';

type Props = {
  reviews: Review[];
  itemId: string;
};

export default function ReviewCard({reviews, itemId}: Props) {
  const [reviewModal, setReviewModal] = React.useState(false);

  return (
    <View style={styles.reviewsContainer}>
      <View style={[gs.flexRow, gs.width100]}>
        <Text style={styles.reviewsHeader}>Reviews </Text>
        <View style={styles.avgReviewView}>
          <Text style={styles.avgReviewText}>4.0</Text>
          <Text style={styles.avg5}>/5</Text>
        </View>
      </View>
      <View style={styles.reviewsBody}>
        {reviews &&
          reviews.map((review, index) => (
            <View key={index} style={styles.review}>
              <View style={gs.flexRow}>
                <Image
                  source={require('../../../../res/default_profile.jpg')}
                  style={styles.reviewerImage}
                />
                <View style={styles.reviewInfo}>
                  <View style={[gs.flexRow, gs.width100]}>
                    <Text style={styles.reviewerName}>
                      {review.reviewerName}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {review.createdAt.toDateString}
                    </Text>
                    <Text style={styles.reviewRating}>{review.rating}/5</Text>
                  </View>
                  <Text style={styles.verifiedText}>
                    <Ant name="checkcircleo" color="#0073fe" size={12} />{' '}
                    Verified Purchase
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewerText}>{review.reviewText}</Text>
            </View>
          ))}
      </View>
      <TouchableOpacity
        onPress={() => setReviewModal(true)}
        style={styles.writeReviewButton}>
        <Text style={styles.reviewButtonText}>
          <FontAwe5 name="feather-alt" size={14} />
          {'  '} Write a Review
        </Text>
      </TouchableOpacity>
      <WriteReviewModal
        itemId={itemId}
        reviewModal={reviewModal}
        setReviewModal={setReviewModal}
      />
    </View>
  );
}

const styles = {
  reviewsContainer: {
    width: 300,
    height: 350,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },

  reviewsHeader: {
    width: '60%',
    ...gs.flex1,
    ...gs.subHeader,
  },

  avgReviewView: {
    ...gs.flex1,
    ...gs.flexRow,
    ...gs.aCenter,
  },
  avgReviewText: {
    fontSize: 30,
    ...gs.bold,
    ...gs.flex1,
  },
  avg5: {
    fontSize: 15,
    marginTop: 10,
    marginRight: 20,
    ...gs.bold,
    ...gs.flex1,
  },

  reviewsBody: {},

  review: {
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    ...gs.flexColumn,
    ...gs.padding20,
    ...gs.radius10,
  },

  reviewerName: {
    flex: 2,
    ...gs.aStretch,
    ...gs.bold,
  },
  reviewDate: {
    flex: 2,
    fontSize: 10,
    color: '#a0a0a0',
    textAlign: 'left' as 'left',
    ...gs.aCenter,
  },

  reviewRating: {
    flex: 3,
    fontSize: 10,
    ...gs.bold,
    textAlign: 'right' as 'right',
    ...gs.aSelfCenter,
  },

  reviewerText: {
    marginLeft: 10,
    marginTop: 5,
  },

  writeReviewButton: {
    padding: 10,
    backgroundColor: '#4400fe',
    ...gs.aCenter,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },
  reviewButtonText: {...gs.white},
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: '#0073FE',
    borderWidth: 1,
    marginHorizontal: 10,
  },

  reviewInfo: {
    ...gs.flex1,
  },
  verifiedText: {
    fontSize: 12,
  },
};
