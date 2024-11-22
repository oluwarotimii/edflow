import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.body;

    // Get user from Firebase using the user ID
    const user = await auth.getUser(userId);

    // Send the verification email again
    await sendEmailVerification(user);

    res.status(200).json({ message: 'Verification email sent again. Please check your inbox.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Error resending verification email. Please try again later.' });
  }
}
