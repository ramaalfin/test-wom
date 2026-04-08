import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../../../navigation/AppNavigator';
import CardItem from '../../../components/CardItem';
import {SkeletonCard} from '../../../components/LoadingSkeleton';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import useAppTheme from '../../../hooks/useAppTheme';
import { useItemDetail } from '../hooks';
import { useErrorHandler } from '../../../hooks/useErrorHandler';

type DetailScreenProps = NativeStackScreenProps<AppStackParamList, 'Detail'>;

const DetailScreen: React.FC<DetailScreenProps> = ({route}) => {
  const {itemId} = route.params;
  const theme = useAppTheme();
  const { getErrorDisplayInfo } = useErrorHandler();

  const {data: item, isLoading, isError, error, refetch} = useItemDetail(itemId);

  if (isLoading) {
    return (
      <View 
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        accessibilityLabel="Loading item details"
        accessibilityRole="none"
      >
        <View style={[styles.content, {padding: theme.spacing.lg}]}>
          <SkeletonCard />
        </View>
      </View>
    );
  }

  if (isError) {
    const errorInfo = getErrorDisplayInfo(error);
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <ErrorState
          message={errorInfo.message}
          icon={errorInfo.icon}
          actionText={errorInfo.actionText}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <EmptyState
          message="Item not found"
          icon="🔍"
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      accessibilityLabel={`Details for ${item.title}`}
      accessibilityRole="none"
    >
      <View style={[styles.content, {padding: theme.spacing.lg}]}>
        <CardItem
          item={item}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default DetailScreen;
