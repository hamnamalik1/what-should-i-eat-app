// components/QuestionForm.js
import React, { useState, useEffect } from 'react';
import {
  // eslint-disable-next-line no-unused-vars
  View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QuestionForm({ onResult }) {
  const [apiKey, setApiKey] = useState('');
  const [craving, setCraving] = useState('');
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('MY_OPENAI_KEY').then(stored => {
      if (stored) setApiKey(stored);
    });
  }, []);

  const saveApiKey = async (key) => {
    setApiKey(key);
    await AsyncStorage.setItem('MY_OPENAI_KEY', key);
  };

  const askAI = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Missing API Key', 'Please enter your OpenAI API key.');
      return;
    }

    setLoading(true);

    const prompt = `Give me a meal or recipe suggestion based on the following:
- I'm craving: ${craving || 'anything'}
- Time to cook: ${time || 'any time'}
- Ingredients I want to use: ${ingredients || 'any'}
- Desired difficulty: ${difficulty || 'any'}

Respond with:
1. Name of the dish
2. Why it fits my request
3. Prep/cook time
4. Brief how-to
5. Tips (optional)`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful recipe assistant.' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No suggestion.';
      onResult(reply);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🍽️ What Should I Eat?</Text>

      <TextInput style={styles.input} placeholder="Your OpenAI API Key" value={apiKey} onChangeText={saveApiKey} secureTextEntry />
      <TextInput style={styles.input} placeholder="What are you craving?" value={craving} onChangeText={setCraving} />
      <TextInput style={styles.input} placeholder="How much time to cook?" value={time} onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Ingredients to use" value={ingredients} onChangeText={setIngredients} />
      <TextInput style={styles.input} placeholder="Difficulty (easy/medium/hard)" value={difficulty} onChangeText={setDifficulty} />

      <Button title="Get Food Suggestion" onPress={askAI} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8,
  },
});