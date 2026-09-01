import { useParams } from 'react-router-dom'
import products from '../data/products.json'

export default function ProductPage(){
  const { id } = useParams()
  const product = products.find(p => String(p.id) === String(id))
  if(!product) return <div className="max-w-7xl mx-auto px-4 py-12">Product not found</div>
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <img src={product.image} alt={product.title} className="w-full h-[480px] object-cover rounded" />
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="mt-2 text-gray-600">{product.subtitle}</p>
        <div className="mt-4 text-2xl font-extrabold">${product.price}</div>
        <button className="mt-6 bg-black text-white px-5 py-3 rounded">Add to cart</button>
      </div>
    </div>
  )
}
