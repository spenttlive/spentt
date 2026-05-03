function daysAgo(n) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d
}

export const SAMPLE_EXPENSES = [
  { id: 1,  desc: 'New sneakers',      cat: 'Shopping',        amount: 3200, ts: new Date(daysAgo(4).setHours(14, 14)) },
  { id: 2,  desc: 'Daily coffee',      cat: 'Coffee',          amount: 1400, ts: new Date(daysAgo(7).setHours(8, 30)) },
  { id: 3,  desc: 'Petrol fill-up',    cat: 'Petrol',          amount: 1800, ts: new Date(daysAgo(2).setHours(11, 0)) },
  { id: 4,  desc: 'Grocery shopping',  cat: 'Groceries',       amount: 1200, ts: new Date(daysAgo(1).setHours(18, 0)) },
  { id: 5,  desc: 'Electricity bill',  cat: 'Electricity',     amount: 900,  ts: new Date(daysAgo(5).setHours(9, 0)) },
  { id: 6,  desc: 'Beer with friends', cat: 'Alcohol',         amount: 840,  ts: new Date(daysAgo(6).setHours(21, 0)) },
  { id: 7,  desc: 'Netflix + Spotify', cat: 'Subscriptions',   amount: 650,  ts: new Date(daysAgo(3).setHours(12, 0)) },
  { id: 8,  desc: 'Movie night',       cat: 'Movies & OTT',    amount: 600,  ts: new Date(daysAgo(5).setHours(19, 0)) },
  { id: 9,  desc: 'Udemy course',      cat: 'Education',       amount: 499,  ts: new Date(daysAgo(9).setHours(15, 0)) },
  { id: 10, desc: 'Zomato order',      cat: 'Food & Dining',   amount: 480,  ts: new Date(daysAgo(0).setHours(20, 0)) },
  { id: 11, desc: 'Pharmacy',          cat: 'Pharmacy',        amount: 340,  ts: new Date(daysAgo(8).setHours(11, 0)) },
  { id: 12, desc: 'Cigarettes',        cat: 'Cigarettes',      amount: 260,  ts: new Date(daysAgo(6).setHours(10, 0)) },
  { id: 13, desc: 'Uber ride',         cat: 'Cab & Auto',      amount: 220,  ts: new Date(daysAgo(1).setHours(16, 0)) },
  { id: 14, desc: 'Highway toll',      cat: 'Toll & Parking',  amount: 145,  ts: new Date(daysAgo(2).setHours(11, 30)) },
]
