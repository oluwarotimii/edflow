export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { userId, email, planId } = req.body; // Plan ID and User ID passed from frontend
  
      // Define the subscription amount in kobo (10,000 NGN = 1,000,000 kobo)
      const amountInKobo = 1000000;
  
      // Define subscription plans based on the selected planId
      let plan;
      switch (planId) {
        case 'basic':
          plan = 'PLN_zsdyg27ne54204k'; // Replace with your Paystack plan ID for the basic plan
          break;
        case 'pro':
          plan = 'PLN_zsdyg27ne54204k'; // Replace with your Paystack plan ID for the pro plan
          break;
        case 'enterprise':
          plan = 'PLN_zsdyg27ne54204k'; // Replace with your Paystack plan ID for the enterprise plan
          break;
        default:
          return res.status(400).json({ error: 'Invalid plan selected' });
      }
  
      // Initialize subscription with Paystack
      try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            amount: amountInKobo, // Explicitly set the amount in kobo
            metadata: { userId, planId },
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Paystack API Error:', errorData);
          return res.status(500).json({ error: 'Failed to create subscription' });
        }
  
        const data = await response.json();
        const paymentUrl = data.data.authorization_url;
  
        return res.status(200).json({ paymentUrl });
      } catch (error) {
        console.error('Error creating subscription:', error);
        return res.status(500).json({ error: 'An error occurred while creating the subscription' });
      }
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  