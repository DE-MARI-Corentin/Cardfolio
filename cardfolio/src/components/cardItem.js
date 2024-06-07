// src/components/CardItem.js
import React from 'react';
import moment from 'moment';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

moment().locale('fr');


const CardItem = ({ card }) => {
  let base = 'data:image/png;base64,'+ card.image;
  base = base.trim().replace(/(\r\n|\n|\r)/gm,"");
  return (
    <Card style={styles.card}>
      <Image style={styles.image} source={{ uri: base}}/>
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
    width: 210,
    height: 300,
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
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
