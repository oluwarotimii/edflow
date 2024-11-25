/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

interface UserSubscription {
  planId: string;
  expiryDate: Date;
}

const availablePlans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99/month',
    features: ['Up to 100 students', 'Basic reporting', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99/month',
    features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49.99/month',
    features: ['Unlimited students', 'Full feature access', 'Dedicated account manager', '24/7 phone support'],
  },
];

export function PlanDetails() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.subscription) {
              setUserSubscription({
                planId: userData.subscription.planId,
                expiryDate: userData.subscription.expiryDate.toDate(),
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user subscription:', err);
        setError('Failed to load subscription details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscription();
  }, []);

  const handleSubscribe = async (planId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert('You must be logged in to subscribe.');
        return;
      }

      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          planId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Subscription failed: ${errorData.error}`);
        return;
      }

      const { paymentUrl } = await response.json();

    if (response.ok) {
      // Open the Paystack payment URL in a new tab
      window.open(paymentUrl, '_blank');
    } else {
      setError('Failed to initiate payment');
    }
    } catch (error) {
      console.error('Error handling subscription:', error);
      alert('An error occurred while processing your subscription. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading plan details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (userSubscription) {
    const currentPlan = availablePlans.find((plan) => plan.id === userSubscription.planId);
    if (!currentPlan) {
      return <div className="text-center text-red-500">Error: Invalid subscription plan</div>;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Current Plan: {currentPlan.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold mb-4">{currentPlan.price}</p>
          <p className="mb-4">Your subscription will expire on: {userSubscription.expiryDate.toLocaleDateString()}</p>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button>Manage Subscription</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availablePlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-4">{plan.price}</p>
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
              <Button onClick={() => handleSubscribe(plan.id)}>Subscribe</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
