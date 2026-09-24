export const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount || 0))
export const formatDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
export const vehicleName = (vehicle) => `${vehicle?.brand || ''} ${vehicle?.model || ''}`.trim() || 'Vehicle'
export const vehicleImage = (vehicle) => vehicle?.imageUrls?.find(Boolean) || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85'
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => error?.data?.message || error?.message || error?.error || fallback
