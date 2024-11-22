'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement Paystack payment processing
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    router.push('/onboarding-complete')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Card Number"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="CVV"
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Pay Now'}
        </Button>
      </form>
    </div>
  )
}

