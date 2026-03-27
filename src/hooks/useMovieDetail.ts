import { useQuery } from '@tanstack/react-query';
import { getMovieDetail, getMovieCredits, getMovieReviews } from '../api/movies';

export const movieDetailKeys = {
    detail: (id: number) => ['movie', 'detail', id] as const,
    credits: (id: number) => ['movie', 'credits', id] as const,
    reviews: (id: number) => ['movie', 'reviews', id] as const,
};

export const useMovieDetail = (movieId: number) => {
    return useQuery({
        queryKey: movieDetailKeys.detail(movieId),
        queryFn: () => getMovieDetail(movieId),
    });
};

export const useMovieCredits = (movieId: number) => {
    return useQuery({
        queryKey: movieDetailKeys.credits(movieId),
        queryFn: () => getMovieCredits(movieId),
    });
};

export const useMovieReviews = (movieId: number) => {
    return useQuery({
        queryKey: movieDetailKeys.reviews(movieId),
        queryFn: () => getMovieReviews(movieId),
    });
};
