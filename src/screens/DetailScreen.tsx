import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import theme from '../theme';
import type {RootStackParamList} from '../navigation/RootNavigator';
import {
  useMovieDetail,
  useMovieCredits,
  useMovieReviews,
} from '../hooks/useMovieDetail';
import useFavoritesStore from '../stores/useFavoritesStore';
import RatingStars from '../components/RatingStars';
import CastCard from '../components/CastCard';
import ReviewCard from '../components/ReviewCard';
import {formatDate, formatRuntime} from '../utils/formatters';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC<DetailScreenProps> = ({route}) => {
  const {movieId} = route.params;

  const {data: movie, isLoading: movieLoading} = useMovieDetail(movieId);
  const {data: credits} = useMovieCredits(movieId);
  const {data: reviews} = useMovieReviews(movieId);

  const {isFavorite, addFavorite, removeFavorite, loadFavorites} =
    useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite(movieId)) {
      removeFavorite(movieId);
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        release_date: movie.release_date,
        genre_ids: movie.genres.map(g => g.id),
        popularity: movie.popularity,
        original_language: movie.original_language,
        adult: movie.adult,
      });
    }
  };

  if (movieLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;

  const cast = credits?.cast.slice(0, 10) || [];
  const movieReviews = reviews?.results || [];

  return (
    <ScrollView style={styles.container}>
      {backdropUrl && (
        <Image source={{uri: backdropUrl}} style={styles.backdrop} />
      )}

      <View style={styles.content}>
        <View style={styles.headerSection}>
          {posterUrl && (
            <Image source={{uri: posterUrl}} style={styles.poster} />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <RatingStars rating={movie.vote_average} size={16} />
            <Text style={styles.metaText}>
              {formatDate(movie.release_date)} • {formatRuntime(movie.runtime)}
            </Text>
            <View style={styles.genresContainer}>
              {movie.genres.map(genre => (
                <View key={genre.id} style={styles.genreBadge}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}>
          <Text style={styles.favoriteIcon}>
            {isFavorite(movieId) ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.favoriteText}>
            {isFavorite(movieId) ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              horizontal
              data={cast}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => <CastCard cast={item} />}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {movieReviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Reviews ({movieReviews.length})
            </Text>
            {movieReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  backdrop: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.skeleton,
  },
  content: {
    padding: theme.spacing.lg,
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.skeleton,
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.sm,
  },
  metaText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  genreBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  genreText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  favoriteIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  favoriteText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.md,
  },
  overview: {
    ...theme.typography.body,
    lineHeight: 22,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
  },
});

export default DetailScreen;
