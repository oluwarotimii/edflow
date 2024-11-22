import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-gray-800">
          Edflow
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
          <Button variant="outline">Logout</Button>
        </div>
      </nav>
    </header>
  )
}

