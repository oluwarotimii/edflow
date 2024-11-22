import type { NextApiRequest, NextApiResponse } from 'next'
import https from 'https'
import { db } from '../../../lib/firebase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { email, plan, userId } = req.body

    // Define plan codes and amounts (you should store these in a config file or database)
    const planDetails = {
      basic: { code: 'PLN_basic_monthly', amount: 999 },
      pro: { code: 'PLN_pro_monthly', amount: 1999 },
      enterprise: { code: 'PLN_enterprise_monthly', amount: 4999 },
    }

    const selectedPlan = planDetails[plan]

    if (!selectedPlan) {
      return res.status(400).json({ message: 'Invalid plan selected' })
    }

    const params = JSON.stringify({
      email,
      amount: selectedPlan.amount,
      plan: selectedPlan.code,
    })

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }

    const paystackReq = https.request(options, (paystackRes) => {
      let data = ''

      paystackRes.on('data', (chunk) => {
        data += chunk
      })

      paystackRes.on('end', async () => {
        const response = JSON.parse(data)
        if (response.status) {
          // Update school profile with subscription details
          await db.collection('schools').doc(userId).update({
            subscriptionPlan: plan,
            subscriptionStatus: 'pending',
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          })

          res.status(200).json(response.data)
        } else {
          res.status(400).json({ message: 'Error initializing subscription' })
        }
      })
    }).on('error', (error) => {
      console.error('Error creating subscription:', error)
      res.status(500).json({ message: 'Error creating subscription' })
    })

    paystackReq.write(params)
    paystackReq.end()
  } catch (error) {
    console.error('Subscription creation error:', error)
    res.status(500).json({ message: 'Error creating subscription' })
  }
}

