Deployment finishing touches

Register Stripe webhook in Stripe dashboard → get production STRIPE_WEBHOOK_SECRET
Create Bash's admin user in Supabase Auth (Authentication → Users → Add user)
Confirm all 6 env vars are set in Vercel


Before going live, add these 3 env vars to Vercel:

Var	Where to get it
RESEND_API_KEY	resend.com → API Keys
RESEND_FROM_EMAIL	e.g. HairbyBash <bookings@hairbybash.ca> (domain must be verified in Resend)
RESEND_ADMIN_EMAIL	Bash's email address

<!-- To Add -->
1.) Admin Dashboard Services: 

If she add service it doesn’t shows up in services immediately, but it comes up when you click on book now
2.) Also, there’s no category for kids in the Admin Dashboard if she wants to add a service and it’s for kids it isn’t there I will show that. 
3.) responsiveness across all Phones, and laptop. 
4.)Background image in the landing page: I can research for that if you want.