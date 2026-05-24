import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl, setToken } = useContext(AppContext);

  const onSubmitHandler = async () => {
    setLoading(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", { name, password, email });
        if (data.success) {
          await AsyncStorage.setItem("token", data.token);
          setToken(data.token);
          Alert.alert("Success", "Account created successfully!");
          navigation.replace('Home');
        } else {
          Alert.alert("Error", data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", { password, email });
        if (data.success) {
          await AsyncStorage.setItem("token", data.token);
          setToken(data.token);
          Alert.alert("Success", "Logged in successfully!");
          navigation.replace('Home');
        } else {
          Alert.alert("Error", data.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Back button */}
      {navigation.canGoBack() && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', padding: 16 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{state === "Sign Up" ? "Create Account" : "Welcome Back"}</Text>
          <Text style={styles.subtitle}>
            {state === "Sign Up" ? "Sign up to book appointments" : "Login to access your account"}
          </Text>
        </View>
        
        {state === "Sign Up" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="John Doe" 
              value={name} 
              onChangeText={setName} 
            />
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="you@example.com" 
            keyboardType="email-address" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Min 8 characters" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={onSubmitHandler} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{state === "Sign Up" ? "Create Account" : "Login"}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {state === "Sign Up" ? "Already have an account? " : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}>
            <Text style={styles.switchLink}>{state === "Sign Up" ? "Login here" : "Sign up"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { fontSize: 15, color: '#5f6FFF', fontWeight: '500' },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5f6FFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    color: '#6B7280',
  },
  switchLink: {
    fontSize: 14,
    color: '#5f6FFF',
    fontWeight: '500',
  }
});

export default LoginScreen;
