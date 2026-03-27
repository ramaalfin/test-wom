export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
};

export const formatRuntime = (minutes: number): string => {
    if (!minutes) return 'N/A';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

export const formatRating = (rating: number): string => {
    return rating.toFixed(1);
};
