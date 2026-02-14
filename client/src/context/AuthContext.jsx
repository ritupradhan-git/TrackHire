import React, { createContext, useReducer, useEffect } from 'react';
import authService from '../services/authServices.js';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user, // Assuming user data comes with login/register success
        error: null,
      };
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on initial load or token change
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const user = await authService.getMe(state.token);
          dispatch({ type: 'USER_LOADED', payload: user });
        } catch (err) {
          dispatch({ type: 'AUTH_ERROR', payload: err.message });
        }
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
      }
    };
    loadUser();
  }, [state.token]); // Dependency on state.token ensures user is reloaded if token changes

  // Register User
  const register = async (formData) => {
    try {
      const data = await authService.register(formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { token: data.data.token, user: null }, // Adjust if your backend returns user on register
      });
      // Optionally load user immediately after successful registration
      const user = await authService.getMe(data.data.token);
      dispatch({ type: 'USER_LOADED', payload: user });

    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message;
      dispatch({
        type: 'REGISTER_FAIL',
        payload: errorMsg,
      });
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const data = await authService.login(formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: data.data.token, user: null }, // Adjust if your backend returns user on login
      });
      // Optionally load user immediately after successful login
      const user = await authService.getMe(data.data.token);
      dispatch({ type: 'USER_LOADED', payload: user });
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message;
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errorMsg,
      });
    }
  };

  // Logout User
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;