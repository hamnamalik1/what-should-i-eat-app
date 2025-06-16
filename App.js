import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [question, setQuestion] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!apiKey.trim()) {
      Alert.alert('API Key Missing', 'Please enter your OpenAI API key.');
      return;
    }
    if (!question.trim()) {
      Alert.alert('Question Missing', 'Please enter a question or food craving.');
      return;
    }

    setLoading(true);
    setSuggestion('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful food recommendation assistant.' },
            { role: 'user', content: `What should I eat? ${question}` }
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Request failed');
      }

      const data = await response.json();
      const aiReply = data.choices[0]?.message?.content || 'No suggestion found.';
      setSuggestion(aiReply);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍽️ What Should I Eat?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your OpenAI API Key"
        value={apiKey}
        onChangeText={setApiKey}
        autoCapitalize="none"
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="I'm craving something spicy..."
        value={question}
        onChangeText={setQuestion}
      />

      <Button title="Ask AI" onPress={askAI} />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        suggestion !== '' && <Text style={styles.suggestion}>{suggestion}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 80, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  suggestion: { marginTop: 20, fontSize: 18 },
});