import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export const useRequireAuthAction = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  return (action, message = 'Please login or create an account to continue.') => {
    if (user) {
      action();
      return true;
    }

    toast.error(message);
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    navigate(`/login?redirect=${redirect}`);
    return false;
  };
};
