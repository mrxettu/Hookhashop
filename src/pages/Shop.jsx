import ProductCard from '../components/ProductCard'
import products from '../data/products.json'

export default function Shop(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
