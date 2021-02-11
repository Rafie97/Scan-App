import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function AccountPage() {
  return (
    <ImageBackground
      source={require('../res/android-promotions.png')}
      style={styles.fullBackground}>
      <View style={styles.textView}>
        <Text style={styles.yourWishlistsText}>Your Wishlists</Text>
        <TouchableOpacity
          style={{marginLeft: 50, marginRight: 20, alignSelf: 'center'}}
          onPress={() => this.signOut()}>
          <Text style={{color: 'blue', fontSize: 16, fontFamily: 'Segoe UI'}}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textView: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  yourWishlistsText: {
    fontSize: 24,
    fontFamily: 'Segoe UI',
  },
});
