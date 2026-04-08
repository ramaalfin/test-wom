import { useQuery } from '@tanstack/react-query';
import { getItems } from '../../../services/api/items';
import type { Item } from '../../../types/api.types';

export const itemKeys = {
    all: ['items'] as const,
};

const useItems = () => {
    return useQuery<Item[]>({
        queryKey: itemKeys.all,
        queryFn: getItems,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

export default useItems;
