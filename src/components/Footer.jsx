import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600 flex justify-between items-center">
        <div>© {new Date().getFullYear()} Hookhashop</div>
        <div className="flex gap-4">
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  )
}
