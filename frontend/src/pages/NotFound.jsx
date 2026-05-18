import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="container-padded grid min-h-[60vh] place-items-center text-center">
    <div>
      <h1 className="text-6xl font-black">404</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">This page does not exist.</p>
      <Link className="btn-primary mt-6" to="/">Go home</Link>
    </div>
  </div>
);
