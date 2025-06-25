// components/ResultView.js
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

export default function ResultView({ result, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🍳 Your Food Suggestion</Text>
      <Text style={styles.result}>{result}</Text>
      <Button title="🔁 Ask Again" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  result: {
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    lineHeight: 22,
  },
});