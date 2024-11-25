'use client'

import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { Eye, EyeOff } from 'lucide-react'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()


  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   console.log('Login attempt:', { email });

  //   try {
  //     // Step 1: Send login request to the backend API
  //     console.log('Sending login request to backend API...');
  //     const response = await fetch('/api/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     console.log('Backend response:', data);

  //     if (response.ok) {
  //       // Step 2: Use the backend response to sign in
  //       console.log('Login successful. UserId:', data.userId);

  //       // Assuming your backend provides a custom Firebase token
  //       console.log('Signing in user with custom token...');
  //       await signInWithCustomToken(auth, data.customToken);

  //       console.log('User successfully authenticated');
  //       router.push('/dashboard');
  //     } else {
  //       // Step 3: Handle failed login attempts
  //       console.error('Login failed. Backend message:', data.message);
  //       setError(data.message || 'Login failed. Please try again.');
  //     }
  //   } catch (error) {
  //     // Step 4: Handle unexpected errors
  //     console.error('Error during login process:', error);
  //     setError('An unexpected error occurred. Please try again.');
  //   } finally {
  //     // Step 5: Always finalize the process
  //     console.log('Login process finished.');
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Show loading state
    
    try {
      // Step 1: Set the persistence to browser session or local persistence
      await setPersistence(auth, browserLocalPersistence); 
      console.log('Attempting to sign in with email:', email);
      
      // Step 2: Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('User signed in successfully:', userCredential.user.uid);
      
      // Step 3: Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during login process:', error);
      
      // Step 4: Handle different error cases with user-friendly messages
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false); // Hide loading state
    }
  };
  


  
  
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-100 to-white">
      {loading && <LoadingScreen />}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Login to Edflow</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-8 text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

