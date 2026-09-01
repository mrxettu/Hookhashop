import React from 'react'
import ProductCard from '../components/ProductCard'
import products from '../data/products.json'

export default function Home(){
  const featured = products.slice(0,4)
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-extrabold">Hookhashop — Premium Hookah Store</h1>
          <p className="mt-4 text-gray-600">Discover curated hookahs, accessories, and travel kits. Fast shipping and trusted quality.</p>
          <div className="mt-6">
            <a href="/shop" className="bg-black text-white px-4 py-2 rounded">Shop now</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featured.map(p => (
            <div key={p.id} className="bg-white rounded shadow p-4">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Featured products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  )
}
