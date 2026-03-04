import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * Format a date string to relative time (e.g. "3 分钟前")
 */
export const formatTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: zhCN,
    });
  } catch {
    return '刚刚';
  }
};

/**
 * Format a number to compact form (e.g. 1200 → "1.2k")
 */
export const formatViewCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};
