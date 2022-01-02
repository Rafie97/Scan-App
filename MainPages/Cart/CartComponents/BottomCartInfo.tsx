import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import gs from '../../../Styles/globalStyles';

type Props = {
  cartSum: number[];
  isReceipt?: boolean;
};

export default function BottomCartInfo({cartSum, isReceipt = false}: Props) {
  return (
    <View style={styles.bottomInfoContainer}>
      <View style={styles.receiptView}>
        <View style={styles.receiptRow}>
          <Text style={styles.totalTitles}>Subtotal</Text>
          <Text style={styles.subtotalValue}>${cartSum[0].toFixed(2)}</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.totalTitles}>Tax</Text>
          <Text style={styles.totalNumbersText}>+${cartSum[1].toFixed(2)}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.totalTitles}>Total</Text>
          <Text style={[styles.totalNumbersText, gs.bold]}>
            ${cartSum[2].toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.checkoutButtonView}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            return;
          }}>
          <Text style={styles.checkoutText}>
            {isReceipt ? 'Buy again' : 'Checkout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  bottomInfoContainer: {
    height: '28%',
    marginBottom: 60,
    ...gs.flexColumn,
    ...gs.width100,
  },

  receiptView: {
    height: '65%',
    ...gs.flexColumn,
    ...gs.width100,
  },

  receiptRow: {
    borderTopWidth: 1,
    borderColor: '#E6E6E6',
    ...gs.flexRow,
    ...gs.width100,
  },

  taxRow: {
    ...gs.flexRow,
    ...gs.width100,
  },

  totalTitles: {
    textAlign: 'left' as 'left',
    fontSize: 16,
    marginVertical: 8,
    marginLeft: 20,
    ...gs.flex1,
    ...gs.bold,
  },
  totalNumbersText: {
    letterSpacing: 0.25,
    textAlign: 'right' as 'right',
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 5,
    ...gs.flex1,
  },
  subtotalValue: {
    letterSpacing: 0.75,
    fontSize: 16,
    textAlign: 'right' as 'right',
    marginHorizontal: 20,
    marginVertical: 5,
    ...gs.flex1,
  },

  checkoutButtonView: {
    height: '30%',
    ...gs.width100,
  },

  checkoutButton: {
    width: '40%' as '40%',
    height: 50,
    borderRadius: 40,
    ...gs.jCenter,
    ...gs.aSelfCenter,
    ...gs.bgBlue,
    ...gs.shadow,
  },
  checkoutText: {
    fontSize: 20,
    ...gs.bold,
    ...gs.taCenter,
    ...gs.white,
  },
};
