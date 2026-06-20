export function formatDate(isoDate) {
  if (!isoDate) return '';
  return String(isoDate).split('-').join('/');
}

export function formatProfit(profit) {
  const amount = Number(profit);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}
