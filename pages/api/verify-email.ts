// pages/api/verify-email.ts
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.body;  // Assuming userId is sent when the user logs in or verifies email

    // Fetch user data from Firebase Authentication
    const userRecord = await auth.getUser(userId);

    // Check if the user's email is verified
    if (userRecord.emailVerified) {
      // Update Firestore to reflect that the email is verified
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        isEmailVerified: true,
      });

      // Send a success response
      res.status(200).json({ message: 'Email verified successfully.' });
    } else {
      res.status(400).json({ message: 'Email not yet verified.' });
    }
  } catch (error) {
    console.error('Error checking email verification status:', error);
    res.status(500).json({ message: 'Error verifying email. Please try again.' });
  }
}
