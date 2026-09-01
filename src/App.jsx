import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/Product'
import Header from './components/Header'
import Footer from './components/Footer'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import { CartProvider } from './context/CartContext'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App(){
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <ErrorBoundary>
          <main className="min-h-[70vh]">
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/shop" element={<Shop/>} />
              <Route path="/product/:id" element={<ProductPage/>} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/about" element={<About/>} />
              <Route path="/contact" element={<Contact/>} />
            </Routes>
          </main>
        </ErrorBoundary>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
}
