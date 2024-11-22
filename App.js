import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [categorias, setCategorias] = useState(['Picolé', 'Sorvetes', 'Coberturas', 'Cones']);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [movimentoQuantidade, setMovimentoQuantidade] = useState('');

  // Carregar o estoque ao iniciar o aplicativo
  useEffect(() => {
    const carregarEstoque = async () => {
      const data = await AsyncStorage.getItem('estoque');
      if (data) setEstoque(JSON.parse(data));
    };
    carregarEstoque();
  }, []);

  // Salvar o estoque sempre que for atualizado
  useEffect(() => {
    AsyncStorage.setItem('estoque', JSON.stringify(estoque));
  }, [estoque]);

  // Adicionar Produto
  const adicionarProduto = () => {
    if (produto && parseInt(quantidade) > 0 && categoriaSelecionada) {
      const index = estoque.findIndex(item => item.produto === produto);
      if (index >= 0) {
        const novoEstoque = [...estoque];
        novoEstoque[index].quantidade += parseInt(quantidade);
        setEstoque(novoEstoque);
      } else {
        setEstoque([
          ...estoque,
          { categoria: categoriaSelecionada, produto, quantidade: parseInt(quantidade) },
        ]);
      }
      setProduto('');
      setQuantidade('');
      setCategoriaSelecionada('');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
    }
  };

  // Registrar Entrada
  const entradaProduto = () => {
    if (produto && parseInt(movimentoQuantidade) > 0) {
      const index = estoque.findIndex(item => item.produto === produto);
      if (index >= 0) {
        const novoEstoque = [...estoque];
        novoEstoque[index].quantidade += parseInt(movimentoQuantidade);
        setEstoque(novoEstoque);
        setMovimentoQuantidade('');
      } else {
        Alert.alert('Erro', 'Produto não encontrado.');
      }
    } else {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
    }
  };

  // Registrar Saída
  const saidaProduto = () => {
    if (produto && parseInt(movimentoQuantidade) > 0) {
      const index = estoque.findIndex(item => item.produto === produto);
      if (index >= 0) {
        if (estoque[index].quantidade >= parseInt(movimentoQuantidade)) {
          const novoEstoque = [...estoque];
          novoEstoque[index].quantidade -= parseInt(movimentoQuantidade);
          setEstoque(novoEstoque);
          setMovimentoQuantidade('');
        } else {
          Alert.alert('Erro', 'Quantidade insuficiente no estoque.');
        }
      } else {
        Alert.alert('Erro', 'Produto não encontrado.');
      }
    } else {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
    }
  };

  // Renderizar Item do Estoque
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>
        {item.categoria} - {item.produto}: {item.quantidade}
      </Text>
      {item.quantidade < 5 && (
        <Text style={styles.alertText}> (Reposição necessária)</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque - Sorveteria Nellito</Text>

      {/* Selecionar Categoria */}
      <Text style={styles.label}>Categoria</Text>
      <Picker
        selectedValue={categoriaSelecionada}
        onValueChange={itemValue => setCategoriaSelecionada(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categorias.map((categoria, index) => (
          <Picker.Item key={index} label={categoria} value={categoria} />
        ))}
      </Picker>

      {/* Adicionar Produto */}
      <TextInput
        placeholder="Nome do Produto"
        value={produto}
        onChangeText={setProduto}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Adicionar Produto" onPress={adicionarProduto} />

      {/* Movimentação de Estoque */}
      <TextInput
        placeholder="Quantidade de Movimento"
        value={movimentoQuantidade}
        onChangeText={setMovimentoQuantidade}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Registrar Entrada" onPress={entradaProduto} />
      <Button title="Registrar Saída" onPress={saidaProduto} />

      {/* Lista de Estoque */}
      <Text style={styles.subtitle}>Estoque Atual</Text>
      <FlatList
        data={estoque}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
} 0

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  alertText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
