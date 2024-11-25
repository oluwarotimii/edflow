'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { SchoolProfileForm } from '@/components/school-profile-form'
import { PlanDetails } from '@/components/plan-details'
import { SchoolStats } from '@/components/school-stats'
import { LoadingScreen } from '@/components/ui/loading-screen'
import {  onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { auth } from '@/lib/firebase'

// Mock data - replace with actual data fetching logic
const mockSchoolProfile = {
  schoolName: 'Sunshine Academy',
  address: '123 Education St, Learning City',
  email: 'info@sunshineacademy.com',
  phoneNumber: '(555) 123-4567',
}


const mockPlanDetails = {
  name: 'Pro',
  price: '$19.99/month',
  features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'],
}

export default function DashboardPage() {
  const [schoolProfile, setSchoolProfile] = useState(mockSchoolProfile)
  const [planDetails, setPlanDetails] = useState(mockPlanDetails)
  const [subscribed, setSubscribed] = useState(false); 
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          setLoading(true); // Set loading to true while fetching data
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setSchoolProfile(userData.schoolProfile || {}); // Load school profile
            setPlanDetails(userData.planDetails || {}); // Load plan details
            setSubscribed(userData.subscribed || false); // Check if subscribed
          } else {
            console.error('User document does not exist');
            router.push('/school-profile'); // Redirect to profile setup if no profile
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/login'); // Redirect to login if there's an error fetching data
        } finally {
          setLoading(false); // Hide loading state after data is fetched
        }
      } else {
        router.push('/login'); // Redirect to login if no user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, [auth, router]);

  if (loading) {
    return <LoadingScreen />; // Display loading screen while fetching data
  }

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { schoolProfile: updatedProfile }, { merge: true });

      setSchoolProfile(updatedProfile);
      alert('School profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update school profile. Please try again.');
    }
  };

  const handlePlanSelection = async (selectedPlan) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        { subscribed: true, planDetails: selectedPlan },
        { merge: true }
      );

      setSubscribed(true);
      setPlanDetails(selectedPlan);
      alert('Subscription successful!');
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">School Profile</TabsTrigger>
            <TabsTrigger value="plan">Plan Details</TabsTrigger>
            <TabsTrigger value="stats">School Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>School Profile</CardTitle>
                <CardDescription>View and update your school's information</CardDescription>
              </CardHeader>
              <CardContent>
                <SchoolProfileForm initialData={schoolProfile} onSubmit={handleProfileUpdate} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plan">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>View your current plan details</CardDescription>
              </CardHeader>
              <CardContent>
              <PlanDetails
                onSelectPlan={handlePlanSelection} 
              />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>School Statistics</CardTitle>
                <CardDescription>Overview of your school's key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <SchoolStats />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

