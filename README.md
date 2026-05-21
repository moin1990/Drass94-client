# IdeaVault – Startup Idea Sharing Platform

🌐 **Live Site:** [https://ideavault.vercel.app](https://ideavault.vercel.app)

> A community-driven platform where startup visionaries share, validate, and refine their ideas together.

---

## ✨ Key Features

- **Idea Sharing** – Submit full startup proposals with title, description, problem statement, proposed solution, target audience, budget estimate, tags, and category.
- **Community Discussions** – Authenticated users can add, edit, and delete their own comments on any idea — enabling real-time collaborative feedback.
- **Search & Filter** – Instantly search ideas by title (case-insensitive) and filter by category or date range on the Ideas page.
- **JWT-Protected Private Routes** – Login with email/password or Google OAuth. A JWT token is issued and stored client-side to protect Add Idea, My Ideas, My Interactions, Idea Details, and Profile pages — persisting across page reloads.
- **Dark / Light Theme** – A global theme toggle in the navbar switches seamlessly between dark and light modes, with your preference saved to localStorage.
- **My Ideas Dashboard** – View, update (via modal), and delete (with confirmation modal) all ideas you've created.
- **My Interactions** – See every comment you've made across all ideas, with inline edit and delete controls.
- **Profile Management** – Update your display name and photo URL; changes propagate to Firebase Auth and the backend simultaneously.
- **Dynamic Page Titles** – Every route sets a contextual browser tab title via a custom `useTitle` hook.
- **Trending Section** – The homepage showcases the 6 most-viewed ideas fetched with a `$limit` query.
- **Category Browsing** – Six category cards on the homepage link directly to filtered idea listings.
- **Responsive Design** – Fully responsive across mobile, tablet, and desktop with a collapsible mobile navbar.
- **Custom 404 Page** – A branded Not Found page with navigation shortcuts.
- **Toast Notifications** – All CRUD operations and auth events surface themed toast messages — no default browser alerts used.

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Firebase Auth, React Toastify, Swiper, date-fns, React Icons

**Backend:** Node.js, Express, MongoDB (with indexes), JSON Web Tokens, dotenv, CORS

**Hosting:** Vercel (client) · Render (server)

---

## 🚀 Getting Started

### Client

```bash
cd client
npm install
cp .env.example .env   # Fill in Firebase & API config
npm run dev
```

### Server

```bash
cd server
npm install
cp .env.example .env   # Fill in MongoDB URI & JWT secret
npm run dev
```

---

## 📁 Project Structure

```
ideavault/
├── client/               # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Footer, IdeaCard, Layout, PrivateRoute, etc.
│       ├── context/      # AuthContext, ThemeContext
│       ├── hooks/        # useTitle
│       └── pages/        # Home, Ideas, IdeaDetails, AddIdea, MyIdeas, etc.
└── server/               # Express API
    ├── middleware/        # JWT verifyToken
    └── routes/           # ideas.js, comments.js, users.js
```

---

## 🔒 Environment Variables

**Client `.env`**
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=https://your-server.onrender.com
```

**Server `.env`**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=https://your-site.vercel.app
```
