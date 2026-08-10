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
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  const googleLogin = async (idToken) => {
    dispatch(loginStart());
    try {
      const data = await authService.googleLogin(idToken);
      dispatch(loginSuccess(data));
      toast.success('Logged in with Google successfully!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.response?.data?.message || 'Google login failed';
      dispatch(loginFailure(msg));
      toast.error(msg);
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
    googleLogin,
    register,
    logout,
  };
};
