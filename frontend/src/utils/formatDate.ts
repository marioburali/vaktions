export function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return '—';

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
