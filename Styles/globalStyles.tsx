import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },

  header: {
    margin: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 24,
  },

  width100: {
    width: '100%',
  },

  height100: {
    height: '100%',
  },

  aSelfCenter: {
    alignSelf: 'center',
  },

  aCenter: {
    alignItems: 'center',
  },

  flexRow: {
    flexDirection: 'row',
  },

  flexColumn: {
    flexDirection: 'column',
  },

  jCenter: {
    justifyContent: 'center',
  },

  margin20: {
    margin: 20,
  },

  taCenter: {
    textAlign: 'center',
  },

  bgWhite: {
    backgroundColor: '#fff',
  },

  bgBlue: {
    backgroundColor: '#0073FE',
  },

  radius10: {
    borderRadius: 10,
  },

  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
});

export default styles;
