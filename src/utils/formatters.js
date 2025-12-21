import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCurrency = (amount, currency = 'Rs.') => {
  if (amount === null || amount === undefined) return 'N/A';
  return `${currency} ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return Number(num).toLocaleString('en-IN');
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return `${Number(value).toFixed(2)}%`;
};
