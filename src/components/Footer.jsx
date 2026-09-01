export default function Footer(){
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600">
        © {new Date().getFullYear()} Hookhashop — Built with React + Tailwind
      </div>
    </footer>
  )
}
