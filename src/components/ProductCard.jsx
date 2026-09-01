import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({product}){
  const { addToCart } = useCart()
  const firstImage = product.imageResolved || product.image || (Array.isArray(product.imagesResolved) && product.imagesResolved[0]) || (Array.isArray(product.images) && product.images[0]) || '/assets/images/fallback.svg'
  return (
    <article className="bg-white border rounded-md overflow-hidden shadow-sm hover:shadow-md flex flex-col">
      <Link to={`/product/${product.id}`} className="block flex-1">
        <img
          src={firstImage}
          alt={product.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = '/assets/images/fallback.svg' }}
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.subtitle || product.short_description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">${product.price}</div>
          <button onClick={() => addToCart(product, 1)} className="bg-black text-white px-3 py-1 rounded text-sm">Add</button>
        </div>
      </div>
    </article>
  )
}
