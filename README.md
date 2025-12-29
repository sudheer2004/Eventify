# Mini Event Platform 

A full-stack **event management web application** where users can create events, RSVP to attend, and manage their participation. Built using the **MERN stack** with a focus on scalability, clean UI, and concurrency safety.

---

## Live Demo

* **Deployement:** [https://eventify-topaz-seven.vercel.app/](https://eventify-topaz-seven.vercel.app/)

---

## Key Features

### Core

* User authentication with **JWT**
* Create, edit, delete events (CRUD)
* RSVP system with **strict capacity enforcement**
* Event image upload using **Cloudinary**
* Personal dashboard (created & joined events)
* Responsive UI + **Dark mode**

### Advanced

* **AI-powered event description generation** (Google Gemini)
* **Atomic RSVP handling** to prevent overbooking
* Protected routes & authorization
* Real-time form validation and error handling

---

## Concurrency Handling (Brief)

To prevent overbooking when multiple users RSVP simultaneously, the backend uses **MongoDB atomic operations (`findOneAndUpdate`)** with capacity checks.
This guarantees:

* No race conditions
* No duplicate RSVPs
* Accurate attendee counts even under high traffic

---

## Tech Stack

**Frontend:** React, React Router, Tailwind CSS, Shadcn UI
**Backend:** Node.js, Express.js
**Database:** MongoDB + Mongoose
**Auth:** JWT, Bcrypt
**Storage:** Cloudinary
**AI:** Google Gemini API
**Deployment:** Vercel (Frontend), Render(Backend), MongoDB Atlas

---

## ⚙️ Local Setup (Quick)

### 1️⃣ Clone Repo

```bash
git clone https://github.com/sudheer2004/Eventify
cd Eventify
```

### 2️⃣ Backend

```bash
cd server
npm install
npm run dev
```

Create `.env` in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-platform
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
GEMINI_API_KEY=xxx
```

### 3️⃣ Frontend

```bash
cd client
npm install
npm run dev
```

Create `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
client/   → React frontend
server/   → Express backend
README.md → Project documentation
```

---

## 🔗 API Overview

* `POST /api/auth/signup` – Register
* `POST /api/auth/login` – Login
* `GET /api/events` – List events
* `POST /api/events` – Create event
* `POST /api/events/:id/rsvp` – RSVP to event
* `DELETE /api/events/:id/rsvp` – Cancel RSVP
* `POST /api/ai/generate-description` – AI description




