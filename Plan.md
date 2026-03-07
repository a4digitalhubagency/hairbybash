Deployment finishing touches

Register Stripe webhook in Stripe dashboard → get production STRIPE_WEBHOOK_SECRET
Create Bash's admin user in Supabase Auth (Authentication → Users → Add user)
Confirm all 6 env vars are set in Vercel


Before going live, add these 3 env vars to Vercel:

Var	Where to get it
RESEND_API_KEY	resend.com → API Keys
RESEND_FROM_EMAIL	e.g. HairbyBash <bookings@hairbybash.ca> (domain must be verified in Resend)
RESEND_ADMIN_EMAIL	Bash's email address
