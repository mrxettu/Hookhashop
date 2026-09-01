import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function Cart(){
  const { items, updateQty, removeFromCart, total, clearCart } = useCart()

  if (!items.length) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
      <Link to="/shop" className="text-blue-600">Continue shopping</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>
      <div className="space-y-4">
        {items.map(it => (
          <div key={it.id} className="flex items-center gap-4 border p-4 rounded">
            <img src={it.image} alt={it.title} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-gray-600">${it.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" value={it.qty} min={1} onChange={e=>updateQty(it.id, Math.max(1, parseInt(e.target.value||1)))} className="w-16 border rounded px-2 py-1" />
              <button onClick={()=>removeFromCart(it.id)} className="text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <button onClick={clearCart} className="text-sm text-gray-600">Clear cart</button>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
          <button className="mt-3 bg-black text-white px-4 py-2 rounded">Proceed to checkout</button>
        </div>
      </div>
    </div>
  )
}
