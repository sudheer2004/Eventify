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

## Concurrency Handling

When multiple users try to RSVP at the same time, the main risk is **overbooking**.
To avoid this, the backend uses **MongoDB’s atomic `findOneAndUpdate` operation** instead of a read-then-write flow.

The RSVP logic is handled in **one database operation** that:

* Checks the event exists
* Ensures the user hasn’t already RSVP’d
* Verifies the event is not at full capacity
* Adds the user to the attendee list

All of these checks happen **inside MongoDB**, not in application memory.

```js
Event.findOneAndUpdate(
  {
    _id: eventId,
    attendees: { $ne: userId },
    $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] }
  },
  { $push: { attendees: userId } },
  { new: true }
)
```

Because MongoDB executes this atomically:

* Two users can’t take the same seat
* Capacity is never exceeded
* Duplicate RSVPs are automatically blocked

If any condition fails, MongoDB simply doesn’t update the document and returns `null`.

---

### Failure Scenarios

When an RSVP fails, the backend performs a quick follow-up check to return the correct message:

* Event doesn’t exist
* User already RSVP’d
* Event is already full

This makes error responses clear and predictable for the frontend.

---

### RSVP Cancellation

RSVP cancellation uses the `$pull` operator, which is also atomic:

```js
{ $pull: { attendees: userId } }
```

This safely removes the user even if multiple cancellations happen at the same time, without affecting other attendees.

---

### Why This Approach Works Well

* No race conditions
* No manual locks or transactions
* Database enforces capacity rules
* Scales reliably under high traffic

This pattern is commonly used in **real-world booking and reservation systems**, where correctness matters more than optimistic updates.

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




