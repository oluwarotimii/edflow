import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../lib/firebase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { userId, schoolProfile } = req.body

    // Update school profile in Firestore
    await db.collection('schools').doc(userId).update(schoolProfile)

    // Here you would typically send a welcome email or perform any other onboarding tasks

    res.status(200).json({ message: 'Onboarding completed successfully' })
  } catch (error) {
    console.error('Onboarding completion error:', error)
    res.status(500).json({ message: 'Error completing onboarding' })
  }
}

