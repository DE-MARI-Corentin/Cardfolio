// src/components/CardItem.js
import React from 'react';
import moment from 'moment';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

moment().locale('fr');


const CardItem = ({ card }) => {
  return (
    <Card style={styles.card}>
      <Image source={{ uri: "data:image/png;base64,"+ card.image}} style={styles.image}></Image>
      <View style={styles.content}>
        <Text style={styles.title}>{card.name}</Text>
        <Text style={styles.subtitle}>{moment(card.published_date).format('Do MMMM YYYY')}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  image: {
    width: "210px",
    height: "300px",
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
    resizeMode: 'cover',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color : 'black',
    margin: 'auto',
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
    margin: 'auto',
  },
});

export default CardItem;
