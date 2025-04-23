import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  ActivityIndicator, 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput,
  RefreshControl 
} from 'react-native';
import { fetchGames, searchGames } from '../services/api';

export default function GameListScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGames();
      setGames(data.results);
      setLoading(false);
    } catch (err) {
      setError('Falha ao carregar os jogos. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    // Implementar debounce para evitar muitas chamadas à API
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(async () => {
      if (text.trim() === '') {
        loadGames();
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await searchGames(text);
        setGames(data.results);
        setLoading(false);
      } catch (err) {
        setError('Falha na busca. Por favor, tente novamente.');
        setLoading(false);
      }
    }, 500));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadGames().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadGames();
  }, []);

  const renderGameItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameDetail', { 
        id: item.id,
        name: item.name
      })}
    >
      <Image
        source={{ uri: item.background_image || 'https://via.placeholder.com/150' }}
        style={styles.gameImage}
        resizeMode="cover"
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gameRating}>⭐ {item.rating}/5</Text>
        <Text style={styles.gameReleased}>Lançamento: {item.released || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Carregando jogos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadGames}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jogos..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>
      
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              Nenhum jogo encontrado. Tente uma busca diferente.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#333',
  },
  searchInput: {
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  list: {
    padding: 10,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  gameImage: {
    width: 100,
    height: 100,
  },
  gameInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  gameTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameRating: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 3,
  },
  gameReleased: {
    color: '#ccc',
    fontSize: 12,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
});
