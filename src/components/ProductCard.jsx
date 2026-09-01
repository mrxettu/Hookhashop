import { Link } from 'react-router-dom'

export default function ProductCard({product}){
  return (
    <article className="bg-white border rounded-md overflow-hidden shadow-sm hover:shadow-md">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} className="w-full h-56 object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.subtitle}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">${product.price}</div>
          <button className="bg-black text-white px-3 py-1 rounded text-sm">Add</button>
        </div>
      </div>
    </article>
  )
}
