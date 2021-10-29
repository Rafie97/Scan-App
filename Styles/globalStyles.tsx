import {StyleSheet} from 'react-native';

////// YO TURN THIS SHIT INTO A REGULAR OBJECT

const styles = {
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center' as 'center',
    backgroundColor: '#fafafa',
  },

  header: {
    margin: 20,
    fontWeight: 'bold' as 'bold',
    textAlign: 'left' as 'left',
    fontSize: 24,
  },

  width100: {
    width: '100%',
  },

  height100: {
    height: '100%',
  },

  aSelfCenter: {
    alignSelf: 'center' as 'center',
  },

  aCenter: {
    alignItems: 'center' as 'center',
  },

  bgBlue: {
    backgroundColor: '#0073FE',
  },

  bgWhite: {
    backgroundColor: '#fff',
  },

  blue: {
    color: '#0073FE',
  },

  flexColumn: {
    flexDirection: 'column' as 'column',
  },

  flexRow: {
    flexDirection: 'row' as 'row',
  },

  jCenter: {
    justifyContent: 'center' as 'center',
  },

  margin20: {
    margin: 20,
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

  taCenter: {
    textAlign: 'center' as 'center',
  },
};

export default styles;
