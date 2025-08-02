// src/components/SearchBar.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Feather name="search" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Search 'gardening essentials'"
          placeholderTextColor="#999"
        />
        <TouchableOpacity>
          <Feather name="mic" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;