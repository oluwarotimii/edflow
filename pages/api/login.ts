import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.error('Invalid method:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed. Only POST requests are accepted.' });
  }

  try {
    console.log('Request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Ensure auth is properly initialized
    console.log('Firebase auth instance:', auth);

    // Attempt to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User successfully authenticated:', userCredential.user.uid);

    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userRef);
    console.log('User document fetched from Firestore:', userDoc.data());

    if (!userDoc.exists()) {
      console.error('User not found in Firestore');
      return res.status(400).json({ message: 'User not found in Firestore.' });
    }

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      userId: userCredential.user.uid,
      userData: userDoc.data(),
    });
  } catch (error: any) {
    console.error('Login error:', error);

    // Specific Firebase auth error handling
    if (error.code === 'auth/user-not-found') {
      return res.status(400).json({ message: 'No user found with this email.' });
    }
    if (error.code === 'auth/wrong-password') {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Generic error handling
    res.status(500).json({ message: 'An unexpected error occurred during login.' });
  }
}
