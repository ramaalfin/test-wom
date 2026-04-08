import apiClient from './client';
import type { Item } from '../../types/api.types';

export const getItems = async (): Promise<Item[]> => {
    const response = await apiClient.get<Item[]>('/posts');
    return response.data;
};

export const getItemDetail = async (id: number): Promise<Item> => {
    const response = await apiClient.get<Item>(`/posts/${id}`);
    return response.data;
};
