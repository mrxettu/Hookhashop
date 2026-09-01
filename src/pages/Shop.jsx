import ProductCard from '../components/ProductCard'
import useProducts from '../hooks/useProducts'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

export default function Shop(){
  const q = useQuery()
  const search = q.get('search') || ''
  const pageNum = parseInt(q.get('page') || '1', 10)
  const pageSize = 12
  const { query, setQuery, page, goToPage, pageItems, total, totalPages } = useProducts({ initialQuery: search, pageSize })
  const navigate = useNavigate()

  useEffect(() => {
    // sync URL when query or page changes
    navigate(`/shop?search=${encodeURIComponent(query || '')}&page=${page}` , { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page])

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..." className="border rounded px-3 py-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pageItems.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button onClick={()=>goToPage(page-1)} disabled={page<=1} className="px-3 py-1 rounded border">Prev</button>
        <span>Page {page} of {totalPages} — {total} items</span>
        <button onClick={()=>goToPage(page+1)} disabled={page>=totalPages} className="px-3 py-1 rounded border">Next</button>
      </div>
    </section>
  )
}
