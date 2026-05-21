import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase.config';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => signInWithPopup(auth, googleProvider);

  const logoutUser = async () => {
    localStorage.removeItem('ideavault_token');
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL });

  const getToken = () => localStorage.getItem('ideavault_token');

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Issue JWT
        try {
          const res = await axios.post(`${API_BASE}/api/users/jwt`, {
            email: currentUser.email,
            name: currentUser.displayName || '',
            photo: currentUser.photoURL || '',
          });
          localStorage.setItem('ideavault_token', res.data.token);
        } catch (err) {
          console.error('JWT error:', err);
        }
      } else {
        setUser(null);
        localStorage.removeItem('ideavault_token');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    updateUserProfile,
    getToken,
    authHeader,
    API_BASE,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
