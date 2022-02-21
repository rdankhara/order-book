const formatter = Intl.DateTimeFormat('en-GB', {dateStyle: 'short', timeStyle: 'medium'});

export const formatDate = (date: Date) => {
    return formatter.format(date);
}