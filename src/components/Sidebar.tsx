import Link from 'next/link'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col p-6 h-full shadow-lg rounded-r-2xl">
      <h2 className="text-2xl font-bold mb-8">Menu</h2>
      <nav className="flex flex-col gap-3">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors font-medium"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
