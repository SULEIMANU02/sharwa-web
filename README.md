sharwadata Web (Next.js)

Commands
- Install: npm install
- Dev: npm run dev

Project
- JavaScript (no TypeScript)
- App Router
- Tailwind CSS
- React Query
- Lottie

Env
- Copy .env.local.example to .env.local and fill in values

Notes
- API endpoints in lib/apiClient.js should point to your backend
- Auth is a simple token-in-localStorage; move to httpOnly cookie for production
- Add more dashboard routes following app/dashboard/* structure
