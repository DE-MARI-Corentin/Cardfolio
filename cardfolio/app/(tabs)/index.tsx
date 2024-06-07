import { View, Text, StyleSheet } from 'react-native';
import NewReleasesScreen from '../../src/Screens/newReleasesScreen';
export default function Home() {
  return (
    <View style={styles.container}>
      <NewReleasesScreen></NewReleasesScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
