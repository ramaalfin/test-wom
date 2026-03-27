import { useState, useEffect } from 'react';
import {
    getRecentSearches,
    saveRecentSearch,
    clearRecentSearches,
} from '../utils/storage';

const useRecentSearches = () => {
    const [searches, setSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSearches();
    }, []);

    const loadSearches = async () => {
        setIsLoading(true);
        const data = await getRecentSearches();
        setSearches(data);
        setIsLoading(false);
    };

    const addSearch = async (keyword: string) => {
        await saveRecentSearch(keyword);
        await loadSearches();
    };

    const clearAll = async () => {
        await clearRecentSearches();
        setSearches([]);
    };

    return {
        searches,
        isLoading,
        addSearch,
        clearAll,
    };
};

export default useRecentSearches;
