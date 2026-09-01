import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/Product'
import Header from './components/Header'
import Footer from './components/Footer'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'

export default function App(){
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <main className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/shop" element={<Shop/>} />
            <Route path="/product/:id" element={<ProductPage/>} />
            <Route path="/cart" element={<Cart/>} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
}
