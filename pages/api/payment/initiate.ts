import type { NextApiRequest, NextApiResponse } from 'next'
import https from 'https'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { email, amount } = req.body

    const params = JSON.stringify({
      email,
      amount: amount * 100, // Paystack amount is in kobo
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

      paystackRes.on('end', () => {
        res.status(200).json(JSON.parse(data))
      })
    }).on('error', (error) => {
      console.error('Error initiating payment:', error)
      res.status(500).json({ message: 'Error initiating payment' })
    })

    paystackReq.write(params)
    paystackReq.end()
  } catch (error) {
    console.error('Payment initiation error:', error)
    res.status(500).json({ message: 'Error initiating payment' })
  }
}

