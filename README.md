# Go Shop

Go Shop is a modern MERN e-commerce application with a polished React storefront, Redux state management, JWT authentication, admin product management, wishlist, coupons, Razorpay-ready checkout, Cloudinary-ready uploads, and MongoDB-backed product data.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios, Framer Motion
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT and bcrypt
- Payments: Razorpay
- Images: Cloudinary

## Run Locally

```bash
npm run install:all
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm run dev
```

At minimum, set these backend variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secret
CLIENT_URL=http://localhost:5173
```

Seed products and an admin account:

```bash
npm run seed --prefix backend
```

Default seeded admin:

```text
admin@goshop.dev
admin123
```

## Deployment

Frontend can be deployed to Vercel from the `frontend` folder.

Backend can be deployed to Render from the `backend` folder.

Set `VITE_API_URL` on Vercel to your Render backend API URL, for example:

```env
VITE_API_URL=https://your-api.onrender.com/api
```
