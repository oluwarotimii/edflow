import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Send email verification to the user
    await sendEmailVerification(userCredential.user);

    // Store the user information in Firestore under the 'users' collection
    const userRef = doc(db, 'users', userCredential.user.uid);

    // Save user data in Firestore (e.g., email, role, etc.)
    await setDoc(userRef, {
      email: email,
      isEmailVerified: false, // Email is not verified initially
      role: 'admin',          // Default role
      schoolId: null,         // School will be linked during onboarding
      profileCompleted: false, // Tracks if onboarding is complete
      createdAt: new Date(),   // Timestamp for user creation
    });

    // Return success response
    res.status(200).json({
      message: 'User created successfully. Please verify your email.',
      userId: userCredential.user.uid,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle Firebase errors
    let errorMessage = 'An error occurred. Please try again later.';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Please try a different one.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please provide a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          errorMessage = 'Registration failed. Please try again later.';
      }
    }

    res.status(500).json({ message: errorMessage });
  }
}
