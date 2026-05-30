# Talkora

A real-time chat app for language learners to connect, practice, and grow together. Built with React, Node.js, MongoDB, and Stream Chat.

Live → [talkorast.onrender.com](https://talkorast.onrender.com)



## What it does

- Sign up and verify your email with an OTP
- Set up your profile — native language, learning language, location, bio
- Browse and connect with other language learners
- Send and accept friend requests
- Chat in real-time using Stream Chat
- Start video calls directly from the chat
- Sign in with Google
- Reset your password via OTP if you forget it
- Switch between 30+ themes



## Tech stack

**Frontend**
- React + Vite
- TanStack Query for data fetching
- Zustand for theme state
- DaisyUI + Tailwind CSS
- Stream Chat React SDK
- Stream Video React SDK

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (httpOnly cookies)
- Passport.js for Google OAuth
- Resend for transactional emails
- Stream Chat server SDK



## Project structure

```
Talkora/
├── backend/
│   └── src/
│       ├── config/         # DB, Stream, Passport, Nodemailer
│       ├── controllers/    # Auth, User, Chat logic
│       ├── middleware/      # JWT route protection
│       ├── models/          # User, FriendRequest, OTP schemas
│       └── routes/          # Auth, User, Chat routes
└── frontend/
    └── src/
        ├── components/      # Sidebar, Navbar, Cards, Loaders
        ├── hooks/           # useAuthUser, useLogin, useSignUp, useLogout
        ├── lib/             # Axios instance, API calls, utils
        ├── pages/           # All page components
        └── store/           # Zustand theme store
```



## Running locally

**Prerequisites** — Node.js 18+, MongoDB Atlas account, Stream account, Resend account, Google OAuth credentials

**1. Clone the repo**
```bash
git clone https://github.com/shyamanandssagar/Talkora.git
cd Talkora
```

**2. Install dependencies**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**3. Set up backend environment**

Create `backend/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
NODE_ENV=development
```

Create `frontend/.env`:
```env
VITE_STREAM_API_KEY=your_stream_api_key
```

**4. Run both servers**

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5001`.

---

## Auth flow

- Signup → OTP sent to email → verify → onboarding → home
- Login → password check → if unverified, new OTP sent automatically
- Google → OAuth redirect → JWT issued → onboarding if new user
- Forgot password → OTP → verify → reset token → new password

---

## Deployment

Deployed on Render (single service — backend serves the frontend build).

```bash
# Build frontend
cd frontend && npm run build

# Render start command
npm run start --prefix backend
```

Make sure all environment variables are set in the Render dashboard before deploying.

---

## Screenshots

<img width="1916" height="868" alt="image" src="https://github.com/user-attachments/assets/aefdc27f-a0b6-4a3d-bc3e-d4187d0b36e9" />
<img width="1911" height="860" alt="image" src="https://github.com/user-attachments/assets/e5180ca9-89d2-4769-92f8-aadb33efc09d" />
<img width="1326" height="861" alt="image" src="https://github.com/user-attachments/assets/84ff868f-f918-44da-bfae-f9baa75e265b" />
<img width="1800" height="880" alt="image" src="https://github.com/user-attachments/assets/2cc617fd-1555-4254-bd4b-cc7d16932b22" />
<img width="1907" height="892" alt="image" src="https://github.com/user-attachments/assets/b368966b-971e-4ae6-ac0c-796487e658b3" />
 


