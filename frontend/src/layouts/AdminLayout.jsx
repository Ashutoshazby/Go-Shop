import { BarChart3, Boxes, LayoutDashboard, Package, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  ['Overview', '/admin', LayoutDashboard],
  ['Products', '/admin/products', Boxes],
  ['Orders', '/admin/orders', Package],
  ['Users', '/admin/users', Users]
];

export const AdminLayout = () => (
  <div className="container-padded grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
    <aside className="surface h-max rounded-lg p-3">
      <div className="mb-4 flex items-center gap-2 px-3 py-2 font-black"><BarChart3 size={20} /> Admin</div>
      <nav className="grid gap-1">
        {links.map(([label, path, Icon]) => (
          <NavLink key={path} end={path === '/admin'} to={path} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold ${isActive ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <Outlet />
  </div>
);
