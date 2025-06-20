import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, Chrome } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import MedifyLogo from '@/components/MedifyLogo';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else {
        response = await supabase.auth.signUp({ email, password });
      }

      const { error, data } = response;

      if (error) {
        throw error;
      }
      
      if (!isLogin && data.user && !data.session) {
         toast({
            title: "⚠️ Email Confirmation Required",
            description: "A confirmation link has been sent to your email. Please verify to complete sign up.",
            duration: 7000,
         });
         setEmail('');
         setPassword('');
      } else if (isLogin && data.session) {
        toast({ title: "🎉 Login Successful!", description: "Welcome back to Medify." });
        navigate('/'); 
      } else if (!isLogin && data.user && data.session) {
         toast({
            title: "🎉 Account Created & Logged In!",
            description: "Welcome to Medify! Your account is ready.",
         });
        navigate('/');
      }


    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please check your credentials or network connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: import.meta.env.VITE_REDIRECT_URL 
        }
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Google Sign-In Error",
        description: error.message || "Could not sign in with Google. Ensure it's configured in Supabase.",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };


  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-emerald-100 p-4 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-2xl border-gray-200/50 rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-white p-8 border-b border-gray-100">
          <div className="mx-auto mb-4">
            <MedifyLogo width="w-12" height="h-12" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">{isLogin ? 'Welcome Back!' : 'Create Account'}</CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            {isLogin ? 'Log in to manage your health card.' : 'Sign up to create your Medify health card.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm"
                disabled={loading || googleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-400" /> Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••• (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-sm pr-10"
                  disabled={loading || googleLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || googleLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full creative-gradient text-white font-semibold text-base py-3 shadow-md hover:shadow-lg transition-all duration-300" disabled={loading || googleLoading}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />)}
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full text-base py-3 border-gray-300 hover:bg-gray-50 transition-all duration-300" 
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Chrome className="w-5 h-5 mr-2 text-red-500" />
            )}
            {googleLoading ? 'Redirecting...' : 'Sign in with Google'}
          </Button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Button
              variant="link"
              className="font-semibold text-green-600 hover:text-green-500 p-1 ml-1"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
              }}
              disabled={loading || googleLoading}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthPage;