import Link from 'next/link'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-6">Menu</h2>
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
