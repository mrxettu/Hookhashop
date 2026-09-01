import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function useCart(){
  return useContext(CartContext)
}

export function CartProvider({ children }){
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('hookhashop_cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try { localStorage.setItem('hookhashop_cart', JSON.stringify(items)) } catch {}
  }, [items])

  function addToCart(product, qty = 1){
    setItems(prev => {
      const found = prev.find(i => String(i.id) === String(product.id))
      if (found) {
        return prev.map(i => i.id === found.id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, qty }]
    })
  }

  function removeFromCart(productId){
    setItems(prev => prev.filter(i => String(i.id) !== String(productId)))
  }

  function updateQty(productId, qty){
    setItems(prev => prev.map(i => String(i.id) === String(productId) ? { ...i, qty } : i))
  }

  function clearCart(){ setItems([]) }

  const total = items.reduce((s, it) => s + (parseFloat(it.price || 0) * it.qty), 0)
  const count = items.reduce((s, it) => s + it.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}
