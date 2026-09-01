import { useMemo, useState } from 'react'
import productsData from '../data/products.json'

export default function useProducts({ initialQuery = '', initialCategory = 'all', pageSize = 12 } = {}){
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = productsData || []
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(p => (p.title||'').toLowerCase().includes(q) || (p.subtitle||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q))
    }
    if (category && category !== 'all') {
      // assume product.categories array or product.category string
      list = list.filter(p => {
        if (!p.categories) return false
        if (Array.isArray(p.categories)) return p.categories.includes(category)
        return (p.category === category)
      })
    }
    return list
  }, [query, category])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageItems = useMemo(() => filtered.slice((page-1)*pageSize, page*pageSize), [filtered, page, pageSize])

  function goToPage(n){
    const p = Math.max(1, Math.min(totalPages, n))
    setPage(p)
  }

  function reset(){ setQuery(''); setCategory('all'); setPage(1) }

  return { query, setQuery, category, setCategory, page, goToPage, pageItems, total, totalPages, reset }
}
