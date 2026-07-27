import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from '../redux/slices/authSlice';
import authService from '../services/authService';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const data = await authService.login(email, password);
      dispatch(loginSuccess(data));
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      dispatch(loginFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      toast.success(data.message || 'Registration successful!');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(errorMsg);
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
