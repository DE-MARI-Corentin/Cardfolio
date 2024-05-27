// src/components/SeriesItem.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SeriesItem = ({ series }) => {
  return (
    <View style={styles.seriesItem}>
      <Text style={styles.seriesTitle}>{series.title}</Text>
      <Text style={styles.seriesCount}>{series.count} / {series.total}</Text>
      <Image source={{ uri: "data:image/png;base64," + series.image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  seriesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  seriesTitle: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
  },
  seriesCount: {
    marginRight: 10,
    color: '#aaa',
  },
  image: {
    width: 50,
    height: 70,
    resizeMode: 'cover',
  },
});

export default SeriesItem;
