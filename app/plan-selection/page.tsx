'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Check } from 'lucide-react'
// import { getAuth } from 'firebase/auth'
import { auth } from '@/lib/firebase';


const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    features: ['Up to 100 students', 'Basic reporting', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49.99',
    features: ['Unlimited students', 'Full feature access', 'Dedicated account manager', '24/7 phone support'],
  },
]

export default function PlanSelectionPage() {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  

  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, planId: string) => {
    event.preventDefault();
    setLoading(true);
  
    // Check if Firebase Auth is correctly initialized
    useEffect(() => {
      console.log('Firebase Auth Initialized:', auth);
    }, []);
  
    try {
      const user = auth.currentUser;
  
      if (!user) {
        alert("User not authenticated. Please log in.");
        return;
      }
  
      const idToken = await user.getIdToken();
  
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          planId,
          email: user.email,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment initiation failed");
      }
  
      const data = await response.json();
      console.log("Received data from API:", data);
  
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert("Payment initialization succeeded, but no URL was provided.");
      }
    } catch (error) {
      console.error("Error during payment initialization:", error);
      alert(`An error occurred: ${error.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Select a Plan</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${selectedPlan === plan.id ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">{plan.price}</span> / month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className="flex items-center justify-center w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Select {plan.name} Plan
                </Label>
              </CardFooter>
              {selectedPlan === plan.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
              )}
            </Card>
          ))}
        </RadioGroup>
        <div className="mt-8 flex justify-center">
          <Button type="submit" size="lg" disabled={!selectedPlan || loading}>
            {loading ? <LoadingSpinner /> : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </div>
  )
}

