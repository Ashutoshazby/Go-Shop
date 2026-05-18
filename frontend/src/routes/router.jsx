import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import { Home } from '../pages/Home.jsx';
import { Shop } from '../pages/Shop.jsx';
import { ProductDetails } from '../pages/ProductDetails.jsx';
import { Login, Register, ForgotPassword } from '../pages/Auth.jsx';
import { Cart } from '../pages/Cart.jsx';
import { Checkout } from '../pages/Checkout.jsx';
import { Profile } from '../pages/Profile.jsx';
import { AdminOrders, AdminOverview, AdminProducts, AdminUsers } from '../pages/Admin.jsx';
import { NotFound } from '../pages/NotFound.jsx';

export const router = createBrowserRouter([
  {
    element: <ErrorBoundary><MainLayout /></ErrorBoundary>,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/products/:id', element: <ProductDetails /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/cart', element: <Cart /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/checkout', element: <Checkout /> },
          { path: '/profile', element: <Profile /> }
        ]
      },
      {
        element: <ProtectedRoute adminOnly />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminOverview /> },
              { path: 'products', element: <AdminProducts /> },
              { path: 'orders', element: <AdminOrders /> },
              { path: 'users', element: <AdminUsers /> }
            ]
          }
        ]
      },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
