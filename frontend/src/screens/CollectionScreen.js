// src/screens/CollectionScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CollectionMenu from '../components/CollectionMenu';
import SeriesItem from '../components/SeriesItem';
import { getCollection } from '../services/collectionService';

const CollectionScreen = () => {
  const [selectedSection, setSelectedSection] = useState('Collection');
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCollection(selectedSection);
      setSeries(result);
    };

    fetchData();
  }, [selectedSection]);

  return (
    <View style={styles.container}>
      <CollectionMenu selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
      <FlatList
        data={series}
        renderItem={({ item }) => <SeriesItem series={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default CollectionScreen;
