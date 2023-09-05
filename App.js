import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { TextInputMask } from 'react-native-masked-text';

// Função para verificar a senha (exemplo)
const checkPassword = async (username, password) => {
  try {
    const response = await axios.get(`http://localhost:3001/users/?username=${username}&password=${password}`);
    return response.data.length > 0;
  } catch (error) {
    console.error('Erro ao verificar a senha:', error);
    return false;
  }
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  const fetchDateTime = async () => {
    try {
      const response = await axios.get('http://worldtimeapi.org/api/ip');
      const dateTime = response.data.utc_datetime;
      setCurrentDateTime(moment(dateTime).format(' HH:mm / YYYY-MM-DD'));
    } catch (error) {
      console.error('Erro ao buscar a hora e a data:', error);
    }
  };

  useEffect(() => {
    fetchDateTime();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const isPasswordCorrect = await checkPassword(username, password);

      if (isPasswordCorrect) {
        navigation.navigate('Home', { user: { username } });
      } else {
        setError('Senha incorreta.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Text style={styles.title}>Login</Text>
        <TextInputMask
          style={styles.input}
          placeholder="Nome de Usuário"
          type={'custom'}
          options={{
            mask: '********',
          }}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInputMask
          style={styles.input}
          placeholder="Senha"
          type={'custom'}
          options={{
            mask: '********',
          }}
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Entrar" onPress={handleLogin} disabled={loading} />
        <Text style={styles.dateTime}>{currentDateTime}</Text>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: '#F0F0F0', // Cor de fundo
    padding: 20, // Espaçamento interno
    borderRadius: 10, // Borda arredondada
    width: '80%', // Largura do componente
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;
