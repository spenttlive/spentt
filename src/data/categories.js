export const GROUPS = [
  {
    label: 'Food & Drink',
    cats: [
      { name: 'Food & Dining',   emoji: '🍔', color: '#E8623A', bg: '#FFF0E8' },
      { name: 'Groceries',       emoji: '🛒', color: '#3AAE8A', bg: '#EDFAF4' },
      { name: 'Coffee',          emoji: '☕', color: '#A0522D', bg: '#FFF6EE' },
      { name: 'Alcohol',         emoji: '🍺', color: '#D4880A', bg: '#FFF4E0' },
      { name: 'Sweets & Snacks', emoji: '🍩', color: '#E85480', bg: '#FFE8F0' },
    ],
  },
  {
    label: 'Travel & Transport',
    cats: [
      { name: 'Petrol',           emoji: '⛽', color: '#F5A623', bg: '#FFF6E0' },
      { name: 'Cab & Auto',       emoji: '🚗', color: '#7C6FCD', bg: '#EEF3FF' },
      { name: 'Public Transport', emoji: '🚌', color: '#3B82F6', bg: '#EAF2FF' },
      { name: 'Toll & Parking',   emoji: '🛣️', color: '#6B7280', bg: '#F3F4F6' },
      { name: 'Flight & Train',   emoji: '✈️', color: '#0EA5E9', bg: '#E0F2FE' },
    ],
  },
  {
    label: 'Shopping & Lifestyle',
    cats: [
      { name: 'Shopping',   emoji: '👟', color: '#9B6EE8', bg: '#F5EEFF' },
      { name: 'Clothing',   emoji: '👕', color: '#EC4899', bg: '#FDF2F8' },
      { name: 'Grooming',   emoji: '💈', color: '#14B8A6', bg: '#F0FDFA' },
      { name: 'Gifts',      emoji: '🎁', color: '#F59E0B', bg: '#FFFBEB' },
      { name: 'Cigarettes', emoji: '🚬', color: '#888',    bg: '#F2F2F2' },
    ],
  },
  {
    label: 'Bills & Utilities',
    cats: [
      { name: 'Electricity',      emoji: '💡', color: '#F59E0B', bg: '#FFFBEB' },
      { name: 'Rent',             emoji: '🏠', color: '#6366F1', bg: '#EEF2FF' },
      { name: 'Phone & Internet', emoji: '📱', color: '#3B82F6', bg: '#EAF2FF' },
      { name: 'Insurance',        emoji: '🛡️', color: '#10B981', bg: '#ECFDF5' },
      { name: 'Water & Gas',      emoji: '🚿', color: '#06B6D4', bg: '#ECFEFF' },
    ],
  },
  {
    label: 'Health & Fitness',
    cats: [
      { name: 'Medical',      emoji: '🏥', color: '#EF4444', bg: '#FEF2F2' },
      { name: 'Pharmacy',     emoji: '💊', color: '#2AAA78', bg: '#E8FFF5' },
      { name: 'Gym & Fitness',emoji: '🏋️', color: '#F97316', bg: '#FFF7ED' },
    ],
  },
  {
    label: 'Entertainment',
    cats: [
      { name: 'Movies & OTT',   emoji: '🎬', color: '#E85480', bg: '#FFE8F0' },
      { name: 'Subscriptions',  emoji: '📺', color: '#7C6FCD', bg: '#F0EEFF' },
      { name: 'Gaming',         emoji: '🎮', color: '#8B5CF6', bg: '#F5F3FF' },
      { name: 'Sports & Events',emoji: '🎟️', color: '#10B981', bg: '#ECFDF5' },
    ],
  },
  {
    label: 'Growth',
    cats: [
      { name: 'Education',   emoji: '📚', color: '#3B82F6', bg: '#EAF2FF' },
      { name: 'Books',       emoji: '📖', color: '#92400E', bg: '#FEF3C7' },
      { name: 'Investments', emoji: '📈', color: '#059669', bg: '#ECFDF5' },
    ],
  },
  {
    label: 'Other',
    cats: [
      { name: 'Donations',     emoji: '🤝', color: '#F59E0B', bg: '#FFFBEB' },
      { name: 'Miscellaneous', emoji: '✨', color: '#A8937A', bg: '#FDF8F3' },
    ],
  },
]

export const ALL_CATS = GROUPS.flatMap((g) => g.cats)

export function getCat(name) {
  return ALL_CATS.find((c) => c.name === name) || {
    name: 'Other', emoji: '✨', color: '#A8937A', bg: '#FDF8F3',
  }
}
