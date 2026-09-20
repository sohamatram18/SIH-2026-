import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getMe();
      if (res.data.success) {
        setUser(res.data.user);
        setStudent(res.data.student);
      }
    } catch (err) {
      setUser(null);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const sendOtp = async (phone) => {
    setError(null);
    try {
      const res = await authAPI.sendOtp(phone);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to dispatch OTP. Please check the mobile number.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const verifyOtp = async ({ phone, otp, role, name }) => {
    setError(null);
    try {
      const res = await authAPI.verifyOtp({ phone, otp, role, name });
      if (res.data.success) {
        setUser(res.data.user);
        setStudent(res.data.student);
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP code entered.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const demoLogin = async (demoRoleKey) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.demoLogin(demoRoleKey);
      if (res.data.success) {
        setUser(res.data.user);
        setStudent(res.data.student);
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Demo login failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
      setStudent(null);
    }
  };

  const updateStudentProfileState = (updatedProfile) => {
    setStudent(updatedProfile);
    if (user) {
      setUser({ ...user, hasProfile: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        loading,
        error,
        sendOtp,
        verifyOtp,
        demoLogin,
        logout,
        fetchUser,
        updateStudentProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
