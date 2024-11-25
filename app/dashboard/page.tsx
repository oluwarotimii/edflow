'use client'

import { useState, useEffect, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { SchoolProfileForm } from '@/components/school-profile-form'
import { PlanDetails } from '@/components/plan-details'
import { SchoolStats } from '@/components/school-stats'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { auth } from '@/lib/firebase'
import { Menu } from 'lucide-react'

export default function DashboardPage() {
  const [schoolProfile, setSchoolProfile] = useState({
    schoolName: '',
    address: '',
    email: '',
    phoneNumber: '',
    logoUrl: '',
  })
  const [planDetails, setPlanDetails] = useState({
    name: '',
    price: '',
    features: [],
  })
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid
        try {
          setLoading(true)
          const userRef = doc(db, 'users', userId)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const userData = userSnap.data()
            setSchoolProfile(userData.schoolProfile || {})
            setPlanDetails(userData.planDetails || {})
            setSubscribed(userData.subscribed || false)
          } else {
            console.error('User document does not exist')
            router.push('/school-profile')
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          router.push('/login')
        } finally {
          setLoading(false)
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours()
      let greetingText = ''
      if (currentHour < 12) {
        greetingText = 'Good morning'
      } else if (currentHour < 18) {
        greetingText = 'Good afternoon'
      } else {
        greetingText = 'Good evening'
      }
      setGreeting(`${greetingText}, ${schoolProfile.schoolName}`)
    }

    updateGreeting()
    const intervalId = setInterval(updateGreeting, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [schoolProfile.schoolName])

  if (loading) {
    return <LoadingScreen />
  }

  const handleProfileUpdate = async (updatedProfile: SetStateAction<{ schoolName: string; address: string; email: string; phoneNumber: string; logoUrl: string }>) => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) throw new Error('User not authenticated')

      const userRef = doc(db, 'users', userId)
      await setDoc(userRef, { schoolProfile: updatedProfile }, { merge: true })

      setSchoolProfile(updatedProfile)
      alert('School profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update school profile. Please try again.')
    }
  }

  const handlePlanSelection = async (selectedPlan: SetStateAction<{ name: string; price: string; features: never[] }>) => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) throw new Error('User not authenticated')

      const userRef = doc(db, 'users', userId)
      await setDoc(
        userRef,
        { subscribed: true, planDetails: selectedPlan },
        { merge: true }
      )

      setSubscribed(true)
      setPlanDetails(selectedPlan)
      alert('Subscription successful!')
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Failed to update plan. Please try again.')
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // TODO: Implement file upload to your preferred storage solution (e.g., Firebase Storage)
        // For now, we'll use a placeholder URL
        const logoUrl = URL.createObjectURL(file)
        const updatedProfile = { ...schoolProfile, logoUrl }
        await handleProfileUpdate(updatedProfile)
      } catch (error) {
        console.error('Error uploading logo:', error)
        alert('Failed to upload logo. Please try again.')
      }
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for smaller screens */}
      {/* <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <Button onClick={toggleSidebar} className="mb-4">Close Menu</Button>
          <Header />
        </div>
      </div> */}

      {/* Main content */}
      <div className="flex-grow">
        <Header  />
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">{greeting}</h1>
              <p className="text-gray-600 text-center md:text-left">Welcome to your dashboard</p>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              {schoolProfile.logoUrl && (
                <Image
                  src={schoolProfile.logoUrl}
                  alt="School Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline">
                  {schoolProfile.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
          </div>

          {/* Menu button for smaller screens */}
          <Button onClick={toggleSidebar} className="md:hidden mb-4">
            <Menu className="h-6 w-6 mr-2" /> Menu
          </Button>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="flex flex-wrap justify-center md:justify-start">
              <TabsTrigger value="profile" className="mb-2 md:mb-0">School Profile</TabsTrigger>
              <TabsTrigger value="plan" className="mb-2 md:mb-0">Plan Details</TabsTrigger>
              <TabsTrigger value="stats" className="mb-2 md:mb-0">School Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>School Profile</CardTitle>
                  <CardDescription>View and update your school&apos;s information</CardDescription>
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
                    currentPlan={planDetails}
                    onSelectPlan={handlePlanSelection}
                    isSubscribed={subscribed}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>School Statistics</CardTitle>
                  <CardDescription>Overview of your school&apos;s key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolStats />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

