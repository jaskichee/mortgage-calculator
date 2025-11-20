export function formatLocalDate(d?: Date | string | null) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}. ${month}. ${year}`;
}

export default formatLocalDate;
