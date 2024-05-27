// src/screens/NewReleasesScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CardItem from '../components/CardItems';
import { getNewReleases } from '../services/cardService';

const NewReleasesScreen = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNewReleases();
      console.log(result);
      setCards(result);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        renderItem={({ item }) => <CardItem card={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5} // Adjust number of columns as needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red', // Adjust background color as needed
  },
});

export default NewReleasesScreen;
