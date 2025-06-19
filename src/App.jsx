
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import PublicCardPage from '@/pages/PublicCardPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (_event === 'SIGNED_IN') {
          if (location.pathname === '/auth' || location.pathname === '/') {
            navigate('/'); 
          }
          toast({ title: "🎉 Welcome!", description: "You're now logged in." });
        }
        if (_event === 'SIGNED_OUT') {
          navigate('/');
          toast({ title: "👋 Logged Out", description: "You have successfully logged out." });
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-xl flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">Loading Medify...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Toaster />
      <Header session={session} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage session={session} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/card/:userId" element={<PublicCardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
