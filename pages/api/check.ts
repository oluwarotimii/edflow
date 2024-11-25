// // pages/api/protected-feature.js
// import { firestore as db } from '@/lib/firebase';

// export default async function handler(req, res) {
//   const { userId } = req.body;

//   try {
//     const user = await db.collection('users').doc(userId).get();

//     if (user.exists && user.data().subscriptionStatus === 'active') {
//       return res.status(200).json({ message: 'Access granted to premium feature.' });
//     } else {
//       return res.status(403).json({ error: 'Access denied. Please subscribe.' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Internal server error.' });
//   }
// }
