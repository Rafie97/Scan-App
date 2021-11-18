import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {Card} from 'react-native-elements';
import gs from '../../../../Styles/globalStyles';

type ChartProps = {
  lineChartData: any;
};

export default function PriceChart(props: ChartProps) {
  return (
    <Card containerStyle={styles.chartCard} title="Price History">
      <LineChart
        style={styles.priceChart}
        width={260}
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
    </Card>
  );
}

const styles = {
  chartCard: {
    width: '72%',
    ...gs.radius10,
  },
  priceChart: {
    height: 250,
    width: 350,
  },
};
