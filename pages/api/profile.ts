// api/profile.ts
import { admin } from '@/lib/firebase-admin'; // Import admin SDK initialization
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const profileData = req.body;

      // Validate that the required data is present
      if (!profileData || !profileData.abbreviation || !profileData.name || !profileData.address) {
        return res.status(400).json({ message: 'Abbreviation, name, and address are required' });
      }

      // Get the Firebase ID token from the Authorization header
      const token = req.headers.authorization?.split('Bearer ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      console.log('Authenticated User ID:', userId);

      // Add the schoolId generated from abbreviation
      profileData.schoolId = generateSchoolId(profileData.abbreviation);

      // Create the document reference using the correct Firestore method
      const schoolDocRef = admin.firestore().doc('schools/' + profileData.schoolId);

      // Save the profile data to Firestore
      await schoolDocRef.set({
        ...profileData,
        adminUserId: userId, // Link the admin user ID to the school
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Add timestamp for when the school was created
      });

      // Return success response
      res.status(201).json({ message: 'School profile created successfully', schoolId: profileData.schoolId });
    } catch (error) {
      // Properly handle errors with more detailed checks
      if (error instanceof Error) {
        console.error('Error creating school profile:', error.message);

        // If the error has a `code` property (specific to Firebase or other custom errors), use it
        if ('code' in error) {
          return res.status(500).json({ message: `Firebase Error: ${error.message}` });
        } else {
          // If it's a standard Error object, use its message
          return res.status(500).json({ message: `Error: ${error.message}` });
        }
      } else {
        // Handle unknown error type gracefully
        console.error('Unknown error occurred during profile creation');
        return res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Helper function to generate school ID from abbreviation
function generateSchoolId(abbreviation: string): string {
  const randomNumber = Math.floor(Math.random() * 999) + 1; // Generate random number between 1 and 999
  return `${abbreviation.toUpperCase()}${randomNumber.toString().padStart(3, '0')}`; // Ensure abbreviation is uppercase
}
