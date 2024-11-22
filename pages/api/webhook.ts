// pages/api/paystack/webhook.js
import {firestore } from '@/lib/firebase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body;

    // Check if the event is a successful subscription renewal or payment
    if (event.event === 'subscription.create' || event.event === 'charge.success') {
      const { data } = event;
      const { metadata, status } = data;

      // Only proceed if payment status is 'success'
      if (status === 'success') {
        const userId = metadata.userId;
        const planId = metadata.planId;

        // Update the user's subscription status in the database
        const selectedPlan = getPlanDetails(planId);

        await firestore.collection('users').doc(userId).update({
          subscriptionPlan: selectedPlan.name,
          maxStudents: selectedPlan.maxStudents,
          subscriptionStatus: 'active',
        });

        return res.status(200).send('Webhook processed');
      }
    }

    res.status(400).send('Invalid event');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

const getPlanDetails = (planId) => {
  switch (planId) {
    case 'basic':
      return { name: 'Basic', maxStudents: 100 };
    case 'pro':
      return { name: 'Pro', maxStudents: 500 };
    case 'enterprise':
      return { name: 'Enterprise', maxStudents: Infinity };
    default:
      return { name: 'Unknown', maxStudents: 0 };
  }
};
