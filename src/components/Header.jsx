import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, LogOut, Menu, X, Home as HomeIcon, Info, HelpCircle, UserCircle } from 'lucide-react';
import MedifyLogo from '@/components/MedifyLogo';

const Header = ({ session }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Logout Error", description: error.message, variant: "destructive" });
    } else {
      navigate('/');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon, public: true },
    { href: '/#how-to-use', label: 'How It Works', icon: Info, public: true, isHashLink: true },
    { href: '/#faq', label: 'FAQs', icon: HelpCircle, public: true, isHashLink: true },
  ];

  const getNavLinkClass = (path, isHashLink = false) => {
    let currentPath = location.pathname;
    if (isHashLink) currentPath += location.hash;
    
    const isActive = (path === '/' && currentPath === '/') || 
                     (isHashLink && currentPath === path) || 
                     (!isHashLink && path !== '/' && currentPath.startsWith(path));

    if (isScrolled || mobileMenuOpen) {
      return isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600";
    }
    return isActive ? "text-white font-semibold bg-white/10" : "text-white/80 hover:text-white hover:bg-white/5";
  };
  
  const NavItem = ({ href, label, icon: Icon, isHashLink }) => {
    const handleClick = (e) => {
      setMobileMenuOpen(false);
      if (isHashLink) {
        e.preventDefault();
        const targetId = href.substring(href.indexOf('#') + 1);
        if (location.pathname === '/') {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          navigate('/', { state: { scrollTo: targetId } });
        }
      } else {
        navigate(href);
      }
    };

    return (
      <Link
        to={href}
        onClick={handleClick}
        className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-all duration-200 ${getNavLinkClass(href, isHashLink)}`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Link>
    );
  };
  
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(location.pathname, { replace: true, state: {} }); 
    }
  }, [location, navigate]);

  const logoColorProps = isScrolled || mobileMenuOpen 
    ? { logoColorClass: 'text-green-600', titleColorClass: 'text-gray-800', taglineColorClass: 'text-green-600' }
    : { logoColorClass: 'text-white', titleColorClass: 'text-white', taglineColorClass: 'text-white/80' };

  const logoutButtonClass = isScrolled || mobileMenuOpen 
    ? 'border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600' 
    : 'border-red-400 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-300';

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? 'bg-white/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 group" onClick={() => setMobileMenuOpen(false)}>
            <MedifyLogo 
              showTagline={true}
              {...logoColorProps}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => <NavItem key={link.href} {...link} />)}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const dashboardElement = document.getElementById('dashboard-section');
                    if (dashboardElement) {
                      dashboardElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`${isScrolled || mobileMenuOpen ? 'text-gray-700 hover:text-green-600 hover:bg-green-50/50' : 'text-white/90 hover:text-white hover:bg-white/10'} transition-colors duration-200`}
                >
                  <UserCircle className="w-4 h-4 mr-1.5" />
                  My Card
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout} 
                  className={`${logoutButtonClass} transition-all duration-200`}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')} 
                size="sm" 
                className={`font-semibold transition-opacity duration-200 text-sm ${isScrolled || mobileMenuOpen ? 'creative-gradient text-white hover:opacity-90' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login / Sign Up
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isScrolled || mobileMenuOpen ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'} transition-colors duration-200`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg border-t border-gray-200"
          >
            <nav className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map(link => <NavItem key={link.href} {...link} />)}
              <div className="pt-2 border-t border-gray-100">
                {session ? (
                  <>
                    <Button variant="ghost" onClick={() => { 
                      setMobileMenuOpen(false);
                      const dashboardElement = document.getElementById('dashboard-section');
                      if (dashboardElement) {
                        dashboardElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }} className="w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50/50 py-2.5 px-3 text-base">
                      <UserCircle className="w-5 h-5 mr-2" />
                      My Card
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 py-2.5 px-3 mt-1 text-base">
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="w-full creative-gradient text-white font-semibold hover:opacity-90 transition-opacity mt-2 py-2.5 text-base">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;