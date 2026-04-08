import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '../../../services/api/items';
import type { Item } from '../../../types/api.types';

export const itemDetailKeys = {
    detail: (id: number) => ['item', id] as const,
};

const useItemDetail = (id: number) => {
    return useQuery<Item>({
        queryKey: itemDetailKeys.detail(id),
        queryFn: () => getItemDetail(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

export default useItemDetail;
