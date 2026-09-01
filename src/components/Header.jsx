import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">Hookhashop</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/shop" className="text-gray-700 hover:text-black">Shop</Link>
            <Link to="/about" className="text-gray-700 hover:text-black">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-black">Contact</Link>
            <Link to="/cart" className="text-gray-700 hover:text-black">Cart</Link>
          </nav>
          <div className="md:hidden">
            <button aria-label="Open menu" className="p-2">☰</button>
          </div>
        </div>
      </div>
    </header>
  )
}
