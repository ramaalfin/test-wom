import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../theme';

interface RatingStarsProps {
  rating: number; 
  size?: number;
  showNumber?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  showNumber = true,
}) => {
  const stars = rating / 2;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;

  const starElements = [];
  
  for (let i = 0; i < fullStars; i++) {
    starElements.push('⭐');
  }
  
  if (hasHalfStar && fullStars < 5) {
    starElements.push('⭐'); 
  }
  
  const emptyStars = 5 - starElements.length;
  for (let i = 0; i < emptyStars; i++) {
    starElements.push('☆');
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.stars, {fontSize: size}]}>
        {starElements.join('')}
      </Text>
      {showNumber && (
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: theme.colors.rating,
  },
  ratingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
});

export default RatingStars;
