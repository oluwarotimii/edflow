//register.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'


export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the email verification page
        router.push('/verify-email');  // Adjust the route as needed
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };



  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Register for Edflow</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-2 top-8 text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-2 top-8 text-gray-500 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading} >
            {loading ? <LoadingSpinner /> : 'Register'}
          </Button>
          <Link href={'/login'}>
          <p>  Have an Account? Login</p>
          </Link>
        </form>
      </div>
    </div>
  )
}

