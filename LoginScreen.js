import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { TextInputMask } from 'react-native-masked-text'; // Importe o TextInputMask

// Função para verificar a senha (exemplo)
const checkPassword = async (username, password) => {
  try {
    const response = await axios.get(`http://localhost:3001/users/?username=${username}&password=${password}`);
    return response.data.length > 0; // Retorna true se encontrar um usuário com a combinação de nome de usuário e senha, caso contrário, retorna false.
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
      // Verifique a senha aqui usando a função checkPassword
      const isPasswordCorrect = await checkPassword(username, password);

      if (isPasswordCorrect) {
        // Navega para a tela "Home" com os dados do usuário
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
      <Text style={styles.title}>Login</Text>
      {/* Use TextInputMask com a máscara desejada */}
      <TextInputMask
        style={styles.input}
        placeholder="Nome de Usuário"
        type={'custom'}
        options={{
          mask: '********', // Use a máscara desejada para o nome de usuário
        }}
        value={username}
        onChangeText={text => setUsername(text)}
      />
      {/* Use TextInputMask com a máscara desejada */}
      <TextInputMask
        style={styles.input}
        placeholder="Senha"
        type={'custom'}
        options={{
          mask: '********', // Use a máscara desejada para a senha
        }}
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Entrar" onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.register}>Registrar</Text>
      </TouchableOpacity>
      <Text style={styles.dateTime}>{currentDateTime}</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 200,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  forgotPassword: {
    color: 'blue',
    marginTop: 10,
  },
  register: {
    color: 'green',
    marginTop: 10,
  },
  dateTime: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default LoginScreen;
