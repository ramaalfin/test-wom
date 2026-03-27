import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MovieCard from '../components/MovieCard';
import useInfiniteMovies from '../hooks/useInfiniteMovies';
import theme from '../theme';
import type {Movie} from '../types/movie';
import type {RootStackParamList} from '../navigation/RootNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tabs'
>;

const HomeScreen: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteMovies();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', {movieId: movie.id});
  };

  const movies = data?.pages.flatMap(page => page.results) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.secondary} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Something went wrong.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <MovieCard movie={item} onPress={handleMoviePress} />
        )}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.secondary]}
            tintColor={theme.colors.secondary}
          />
        }
      />
    </View>
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
  list: {
    paddingVertical: theme.spacing.sm,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
  },
});

export default HomeScreen;
