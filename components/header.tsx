/* eslint-disable react-hooks/rules-of-hooks */
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

interface HeaderProps {
  className?: string; // Allow optional className
}

export function Header({ className }: HeaderProps) {
  const handleLogout = async () => {
    const auth = getAuth();

    try {
      // Sign the user out
      await signOut(auth);
      console.log('User signed out successfully');

      // Redirect the user to the login page (or any other page)
      const router = useRouter(); // Correctly define useRouter inside the component
      router.push('/login'); // Adjust the path as needed
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again later.');
    }
  };

  return (
    <header className={`bg-white shadow ${className || ''}`}>
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
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
