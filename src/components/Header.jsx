import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Header(){
  const navigate = useNavigate()
  const { count } = useCart()
  const [q, setQ] = useState('')

  function onSearch(e){
    e.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(q)}`)
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">Hookhashop</Link>

          <form onSubmit={onSearch} className="hidden md:flex items-center gap-2">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="border rounded px-3 py-1 w-64" />
            <button className="px-3 py-1 bg-black text-white rounded">Search</button>
          </form>

          <nav className="flex gap-4 items-center">
            <Link to="/shop" className="text-gray-700 hover:text-black">Shop</Link>
            <Link to="/about" className="text-gray-700 hover:text-black hidden md:inline">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-black hidden md:inline">Contact</Link>
            <Link to="/cart" className="text-gray-700 hover:text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4"/></svg>
              <span className="text-sm">Cart</span>
              {count ? <span className="ml-1 text-xs bg-black text-white px-2 py-0.5 rounded">{count}</span> : null}
            </Link>
          </nav>

          <div className="md:hidden">
            <button aria-label="Open menu" className="p-2">☰</button>
          </div>
        </div>
      </div>
    </header>
  )
}
