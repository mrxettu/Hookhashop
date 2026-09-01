import products from '../data/products.json'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const featured = products.slice(0,4)
  return (
    <section>
      <div className="relative bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <h1 className="text-4xl font-bold">Hookhashop</h1>
          <p className="mt-4 text-lg">Premium hookah products — curated selection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
