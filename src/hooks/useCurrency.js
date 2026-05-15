import { useState } from 'react'

export const CURRENCIES = [
  { symbol: '₹', code: 'INR', label: '₹ INR' },
  { symbol: '$', code: 'USD', label: '$ USD' },
  { symbol: '€', code: 'EUR', label: '€ EUR' },
  { symbol: '£', code: 'GBP', label: '£ GBP' },
  { symbol: '¥', code: 'JPY', label: '¥ JPY' },
  { symbol: 'A$', code: 'AUD', label: 'A$ AUD' },
  { symbol: 'C$', code: 'CAD', label: 'C$ CAD' },
  { symbol: 'Fr', code: 'CHF', label: 'Fr CHF' },
  { symbol: 'د.إ', code: 'AED', label: 'د.إ AED' },
  { symbol: 'S$', code: 'SGD', label: 'S$ SGD' },
]

export function useCurrency() {
  const [currencyCode, setCurrencyCode] = useState(() => {
    return localStorage.getItem('spentt-currency') || 'INR'
  })

  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0]

  const setCurrency = (code) => {
    setCurrencyCode(code)
    localStorage.setItem('spentt-currency', code)
  }

  return { currency, setCurrency, CURRENCIES }
}