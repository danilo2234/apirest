// screens/GameDetailScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { fetchGameDetails } from '../services/api';

export default function GameDetailScreen({ route }) {
  const { id } = route.params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGameDetails();
  }, []);

  const loadGameDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGameDetails(id);
      setGame(data);
      setLoading(false);
    } catch (err) {
      setError('Falha ao carregar os detalhes do jogo. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadGameDetails}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Jogo não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: game.background_image || 'https://via.placeholder.com/400' }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.gameTitle}>{game.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {game.rating}/5</Text>
          <Text style={styles.ratingCount}>({game.ratings_count} avaliações)</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lançamento:</Text>
          <Text style={styles.infoValue}>{game.released || 'Desconhecido'}</Text>
        </View>
        
        {game.developers && game.developers.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Desenvolvedor:</Text>
            <Text style={styles.infoValue}>
              {game.developers.map(dev => dev.name).join(', ')}
            </Text>
          </View>
        )}
        
        {game.publishers && game.publishers.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Publicadora:</Text>
            <Text style={styles.infoValue}>
              {game.publishers.map(pub => pub.name).join(', ')}
            </Text>
          </View>
        )}
        
        {game.genres && game.genres.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Gêneros:</Text>
            <View style={styles.tagsList}>
              {game.genres.map(genre => (
                <View key={genre.id} style={styles.tag}>
                  <Text style={styles.tagText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {game.platforms && game.platforms.length > 0 && (
          <View style={styles.platformsContainer}>
            <Text style={styles.sectionTitle}>Plataformas:</Text>
            <View style={styles.tagsList}>
              {game.platforms.map(platform => (
                <View key={platform.platform.id} style={styles.tag}>
                  <Text style={styles.tagText}>{platform.platform.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {game.description_raw && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descrição:</Text>
            <Text style={styles.descriptionText}>{game.description_raw}</Text>
          </View>
        )}
        
        {game.website && (
          <TouchableOpacity 
            style={styles.websiteButton}
            onPress={() => Linking.openURL(game.website)}
          >
            <Text style={styles.websiteButtonText}>Visitar Site Oficial</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  bannerImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 16,
  },
  gameTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  ratingCount: {
    color: '#ccc',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 16,
    width: 100,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    marginTop: 8,
  },
  platformsContainer: {
    marginTop: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#444',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionText: {
    color: '#ddd',
    fontSize: 16,
    lineHeight: 24,
  },
  websiteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});