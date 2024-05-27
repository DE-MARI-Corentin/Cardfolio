// src/components/CollectionMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CollectionMenu = ({ selectedSection, setSelectedSection }) => {
  return (
    <View style={styles.menu}>
      {['Collection', 'Double', 'Suivi'].map((section) => (
        <TouchableOpacity
          key={section}
          style={[
            styles.menuItem,
            selectedSection === section && styles.selectedMenuItem,
          ]}
          onPress={() => setSelectedSection(section)}
        >
          <Text style={styles.menuItemText}>{section}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#333', // Adjust background color as needed
  },
  menuItem: {
    padding: 10,
  },
  selectedMenuItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#e74c3c', // Highlight color
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CollectionMenu;
