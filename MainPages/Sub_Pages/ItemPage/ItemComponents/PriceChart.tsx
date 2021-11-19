import React from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Card} from 'react-native-elements';
import gs from '../../../../Styles/globalStyles';
import {LineChartDataType} from '../ItemPage';

type ChartProps = {
  lineChartData: LineChartDataType;
};

export default function PriceChart(props: ChartProps) {
  return (
    <View style={styles.chartCard}>
      <Text style={gs.subHeader}>Price Chart</Text>
      <LineChart
        style={styles.priceChart}
        width={315}
        height={250}
        data={props.lineChartData}
        // xAxisLabel="Time"
        // yAxisLabel="Price"
        yAxisInterval={1.0}
        withVerticalLabels={false}
        chartConfig={{
          backgroundColor: '#0073FE',
          backgroundGradientFrom: '#0073FE',
          backgroundGradientTo: '#4400fe',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          // labelColor: (opacity = 1) =>
          //   `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '1',
            stroke: '#4400fe',
          },
        }}
      />
    </View>
  );
}

const styles = {
  chartCard: {
    width: 300,
    height: 300,
    overflow: 'hidden' as 'hidden',
    ...gs.bgWhite,
    ...gs.radius10,
    ...gs.shadow,
  },
  priceChart: {
    height: '100%',
    width: '100%',
    marginLeft: -10,
  },
};
