/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BookOpen, Users, Calendar, BarChart, Shield, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    schoolType: '',
    studentCount: '',
    establishedYear: '',
    facilities: [] as string[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleCheckboxChange = (facility: string, checked: boolean) => {
    setFormData(prevState => ({
      ...prevState,
      facilities: checked
        ? [...prevState.facilities, facility]
        : prevState.facilities.filter(f => f !== facility)
    }))
  }
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission (if used within a form)
    setLoading(true); // Set loading state to true while redirecting

    // Simulate delay before navigating
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation

    router.push('/register'); // Redirect to the /register page
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   console.log('Form submitted:', formData)
  //   // Here you would typically send the data to your backend or Firebase
  //   // For now, we'll just simulate a successful registration
  //   router.push('/email-verification')
  // }

  

  const features = [
    { icon: BookOpen, title: 'Curriculum Management', description: 'Easily manage and update your school curriculum' },
    { icon: Users, title: 'Student Information System', description: 'Keep track of student data, attendance, and performance' },
    { icon: Calendar, title: 'Scheduling', description: 'Effortlessly create and manage class schedules' },
    { icon: BarChart, title: 'Analytics', description: 'Gain insights into school performance and student progress' },
    { icon: Shield, title: 'Security', description: 'Ensure data protection with our robust security measures' },
    { icon: Zap, title: 'Real-time Updates', description: 'Stay informed with instant notifications and updates' },
  ]

  const plans = [
    { name: 'Basic', price: 9.99, features: ['Up to 100 students', 'Basic reporting', 'Email support'] },
    { name: 'Pro', price: 19.99, features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Custom branding'] },
    { name: 'Enterprise', price: 49.99, features: ['Unlimited students', 'Full feature access', 'Dedicated account manager', '24/7 phone support'] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Edflow</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Streamline your school management with our comprehensive platform. 
          From admin tasks to student progress tracking, we&apos;ve got you covered.
        </p>
        <Button size="lg"  onClick={handleStart} 
                disabled={loading} 
                isLoading={loading}
        >Get Started</Button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Edflow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-blue-500 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${plan.price}</span> / month
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc list-inside space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                    Choose {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration and Overview Tabs */}
      <section className="py-20">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Platform Overview</TabsTrigger>
              {/* <TabsTrigger value="register">Register Your School</TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Edflow Platform Overview</CardTitle>
                  <CardDescription>Learn more about how Edflow can transform your school management</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Edflow is a comprehensive school management system designed to streamline administrative tasks,
                    enhance communication between staff, students, and parents, and provide valuable insights into
                    your school&apos;s performance.
                  </p>
                  <p className="mb-4">
                    Our platform offers a range of features including student information management, attendance tracking,
                    grade book, scheduling, communication tools, and advanced analytics. With Edflow, you can focus on
                    what matters most - providing quality education to your students.
                  </p>
                  <p>
                    Ready to revolutionize your school management? Click the &qouts;Register Your School&qouts; tab to get started!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            {/* <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Register Your School</CardTitle>
                  <CardDescription>Provide your school details to get started with Edflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="schoolName">School Name</Label>
                            <Input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="adminName">Admin Name</Label>
                            <Input id="adminName" name="adminName" value={formData.adminName} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="schoolType">School Type</Label>
                            <Select name="schoolType" value={formData.schoolType} onValueChange={(value) => handleSelectChange('schoolType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select school type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="secondary">Secondary</SelectItem>
                                <SelectItem value="higher">Higher Education</SelectItem>
                                <SelectItem value="vocational">Vocational</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="studentCount">Number of Students</Label>
                            <Input id="studentCount" name="studentCount" type="number" value={formData.studentCount} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="establishedYear">Year Established</Label>
                          <Input id="establishedYear" name="establishedYear" type="number" value={formData.establishedYear} onChange={handleInputChange} required />
                        </div>
                        <div>
                          <Label>Facilities</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {['Library', 'Computer Lab', 'Science Lab', 'Sports Field', 'Cafeteria', 'Auditorium'].map((facility) => (
                              <div key={facility} className="flex items-center space-x-2">
                                <Checkbox
                                  id={facility.toLowerCase().replace(' ', '-')}
                                  checked={formData.facilities.includes(facility)}
                                  onCheckedChange={(checked) => handleCheckboxChange(facility, checked as boolean)}
                                />
                                <label
                                  htmlFor={facility.toLowerCase().replace(' ', '-')}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {facility}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Register School</Button>
                </CardFooter>
              </Card>
            </TabsContent> */}
          </Tabs> 
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Edflow</h3>
            <p>Empowering schools with innovative management solutions since 2024.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p>Email: support@edflow.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Twitter</a>
              <a href="#" className="hover:text-blue-600">Facebook</a>
              <a href="#" className="hover:text-pink-600">Instagram</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2024 Edflow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

