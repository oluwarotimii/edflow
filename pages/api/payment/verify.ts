import type { NextApiRequest, NextApiResponse } from 'next'
import https from 'https'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { reference, userId } = req.query

    if (!reference || typeof reference !== 'string' || !userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid reference or user ID' })
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }

    const paystackReq = https.request(options, (paystackRes) => {
      let data = ''

      paystackRes.on('data', (chunk) => {
        data += chunk
      })

      paystackRes.on('end', async () => {
        const response = JSON.parse(data)
        
        if (response.status && response.data.status === 'success') {
          const schoolRef = doc(db, 'schools', userId)
          const schoolDoc = await getDoc(schoolRef)

          if (schoolDoc.exists()) {
            // Update subscription status and payment details
            await updateDoc(schoolRef, {
              subscriptionStatus: 'active',
              lastPaymentDate: new Date(),
              subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Extend by 30 days
            })
          }

          res.status(200).json({ message: 'Payment verified and subscription updated successfully' })
        } else {
          res.status(400).json({ message: 'Payment verification failed' })
        }
      })
    }).on('error', (error) => {
      console.error('Error verifying payment:', error)
      res.status(500).json({ message: 'Error verifying payment' })
    })

    paystackReq.end()
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ message: 'Error verifying payment' })
  }
}

