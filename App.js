import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, Button, Alert, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');

  const [cuisine, setCuisine] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [time, setTime] = useState(30); // in minutes
  const [difficulty, setDifficulty] = useState('easy');

  // Load saved API key when app starts
  useEffect(() => {
    (async () => {
      try {
        const savedKey = await AsyncStorage.getItem('MY_OPENAI_KEY');
        if (savedKey) setApiKey(savedKey);
      } catch (e) {
        console.warn('Failed to load API key');
      }
    })();
  }, []);

  // Save API key to storage
  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    try {
      await AsyncStorage.setItem('MY_OPENAI_KEY', apiKey.trim());
      setMessage('API key is stored!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* API Key input */}
      <Text style={styles.label}>OpenAI API Key:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your API key"
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Save API Key" onPress={saveApiKey} />
      {message !== '' && <Text style={styles.message}>{message}</Text>}

      {/* Cuisine */}
      <Text style={styles.label}>Cuisine Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Italian, Mexican"
        value={cuisine}
        onChangeText={setCuisine}
      />

      {/* Ingredients */}
      <Text style={styles.label}>Ingredients You Have:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. chicken, tomato, cheese"
        value={ingredients}
        onChangeText={setIngredients}
      />

      {/* Time slider */}
      <Text style={styles.label}>
        Time Available: {Math.floor(time / 60)}h {time % 60}m
      </Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={30}
        maximumValue={180}
        step={30}
        value={time}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1EB1FC"
        onValueChange={setTime}
      />

      {/* Difficulty picker */}
      <Text style={styles.label}>Difficulty Level:</Text>
      <View style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}>
        <Picker
          selectedValue={difficulty}
          onValueChange={setDifficulty}
          mode="dropdown"
        >
          <Picker.Item label="Easy" value="easy" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="Hard" value="hard" />
        </Picker>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  message: {
    marginTop: 10,
    color: 'green',
    fontWeight: '600',
  },
  pickerAndroid: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
  },
  pickerIOS: {
    marginBottom: 15,
  },
});