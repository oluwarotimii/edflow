'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuth } from 'firebase/auth'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export  function SchoolProfilePage() {
  const [formData, setFormData] = useState({
    schoolName: '',
    abbreviation: '',
    adminName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    schoolType: '',
    gender: '',
    boardingFacilities: '',
    studentCount: '',
    establishedYear: '',
    facilities: [] as string[],
    website: '',
    description: '',
  })
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // To manage data loading state
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (facility: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, facility]
        : prev.facilities.filter((f) => f !== facility),
    }));
  };

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, 'users', user.uid); // Adjust collection name if different
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.schoolProfile) {
              // Populate formData with saved data
              setFormData(userData.schoolProfile);
            }
          } else {
            console.log('User data not found');
          }
        } else {
          console.log('No authenticated user');
          router.push('/login'); // Redirect if not logged in
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setFetching(false); // Stop fetching state
      }
    };

    fetchUserData();
  }, [router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST', // Change to 'PUT' for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An error occurred');
      }

      alert('School profile saved successfully!');
      router.push('/plan-selection'); // Redirect to the next step
    } catch (error) {
      console.error('Error saving school profile:', error);
      alert('Failed to save school profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div>Loading...</div>; // Show a loader while fetching data
  }
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">School Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="abbreviation">Abbreviation</Label>
                <Input
                  id="abbreviation"
                  name="abbreviation"
                  value={formData.abbreviation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="schoolType">School Type</Label>
                <Select name="schoolType" value={formData.schoolType} onValueChange={(value) => handleSelectChange('schoolType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="higher">Higher Education</SelectItem>
                    <SelectItem value="vocational">Vocational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Gender</Label>
              <RadioGroup
                name="gender"
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boys" id="boys" />
                  <Label htmlFor="boys">Boys</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="girls" id="girls" />
                  <Label htmlFor="girls">Girls</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Mixed</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Boarding Facilities</Label>
              <RadioGroup
                name="boardingFacilities"
                value={formData.boardingFacilities}
                onValueChange={(value) => handleSelectChange('boardingFacilities', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day" id="day" />
                  <Label htmlFor="day">Day School</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boarding" id="boarding" />
                  <Label htmlFor="boarding">Boarding School</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentCount">Number of Students</Label>
                <Input
                  id="studentCount"
                  name="studentCount"
                  type="number"
                  value={formData.studentCount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="establishedYear">Year Established</Label>
                <Input
                  id="establishedYear"
                  name="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website">School Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.yourschool.com"
              />
            </div>
            <div>
              <Label htmlFor="description">School Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your school..."
              />
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Save and Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

