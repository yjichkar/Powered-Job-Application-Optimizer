import { useState, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router';
import { createRouter } from '@/routes';

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjSfDLXgeUIKYWezqD7z38qWMC1ZBgRI0",
  authDomain: "job-opt-system.firebaseapp.com",
  projectId: "job-opt-system",
  storageBucket: "job-opt-system.firebasestorage.app",
  messagingSenderId: "892638334342",
  appId: "1:892638334342:web:bbf103af78792bee2b3007"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const router = useMemo(() => createRouter(user, handleLogout), [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#BFFF0A] text-xl">Loading...</div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;