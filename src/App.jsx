import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/Product'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/shop" element={<Shop/>} />
          <Route path="/product/:id" element={<ProductPage/>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
