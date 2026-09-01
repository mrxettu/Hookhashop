import { useParams } from 'react-router-dom'
import products from '../data/products.json'
import { useCart } from '../context/CartContext'

export default function ProductPage(){
  const { id } = useParams()
  const product = products.find(p => String(p.id) === String(id))
  const { addToCart } = useCart()
  if(!product) return <div className="max-w-7xl mx-auto px-4 py-12">Product not found</div>
  const mainImage = product.image || (Array.isArray(product.images) && product.images[0]) || '/assets/images/fallback.svg'
  const gallery = Array.isArray(product.images) && product.images.length ? product.images : (product.localImages || [])
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img src={mainImage} alt={product.title} loading="lazy" decoding="async" onError={(e)=>{e.currentTarget.src='/assets/images/fallback.svg'}} className="w-full h-[480px] object-cover rounded" />
        {gallery && gallery.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {gallery.map((g,i) => (
              <img key={i} src={g} alt={`${product.title} ${i}`} className="w-full h-20 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="mt-2 text-gray-600">{product.subtitle || product.short_description}</p>
        <div className="mt-4 text-2xl font-extrabold">${product.price}</div>
        <button onClick={()=>addToCart(product,1)} className="mt-6 bg-black text-white px-5 py-3 rounded">Add to cart</button>

        <div className="mt-8 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Description</h3>
          <div>{product.description || 'No further description.'}</div>
        </div>
      </div>
    </div>
  )
}
