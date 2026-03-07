Production Checklist
1. Supabase (Required — blocks build)
 Set NEXT_PUBLIC_SUPABASE_URL in Vercel
 Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel
 Set SUPABASE_SERVICE_ROLE_KEY in Vercel
 Create Bash's admin user: Supabase → Authentication → Users → Add user
2. Stripe (Required before payments go live)
 Set STRIPE_SECRET_KEY in Vercel (use the live key, not test)
 Register the Vercel webhook URL in Stripe Dashboard → Webhooks → get the live STRIPE_WEBHOOK_SECRET
 Set STRIPE_WEBHOOK_SECRET in Vercel
 Set NEXT_PUBLIC_APP_URL to your Vercel domain (e.g. https://hairbybash.ca)
3. Email via Resend (Required before booking confirmations go live)
 Sign up at resend.com and create an API key
 Verify your sending domain in Resend (e.g. hairbybash.ca)
 Set RESEND_API_KEY in Vercel
 Set RESEND_FROM_EMAIL → e.g. HairbyBash <bookings@hairbybash.ca>
 Set RESEND_ADMIN_EMAIL → hairbybash01@gmail.com
