import React from 'react';
import { Heart, Home, HelpCircle, Info, Mail } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const quickLinks = [
    { name: 'Home', href: '#root', icon: Home, action: (e) => handleLinkClick(e, 'root') },
    { name: 'How It Works', href: '#how-to-use', icon: Info, action: (e) => handleLinkClick(e, 'how-to-use') },
    { name: 'FAQ', href: '#faq', icon: HelpCircle, action: (e) => handleLinkClick(e, 'faq') },
  ];

  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-10"> {/* Reduced py-12 to py-8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-6"> {/* Reduced gap-10 to gap-8, mb-8 to mb-6 */}
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="font-semibold text-slate-100 text-md">Quick Links</p> {/* Reduced text-lg to text-md */}
            <ul className="mt-3 space-y-1.5"> {/* Reduced mt-4 to mt-3, space-y-2 to space-y-1.5 */}
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Button
                    variant="link"
                    onClick={(e) => link.action(e)}
                    className="text-slate-300 hover:text-green-400 transition-colors duration-200 flex items-center justify-center md:justify-start gap-1.5 p-0 h-auto text-xs" /* Reduced gap-2 to gap-1.5, text-sm to text-xs */
                  >
                    <link.icon className="w-3.5 h-3.5" /> {/* Reduced w-4 h-4 to w-3.5 h-3.5 */}
                    {link.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <p className="text-xs"> {/* Reduced text-sm to text-xs */}
              © {new Date().getFullYear()} Medify. All rights reserved.
            </p>
            <p className="text-[10px] mt-0.5 text-slate-400"> {/* Reduced text-xs to text-[10px], mt-1 to mt-0.5 */}
              Your health, in your hands.
            </p>
            <div className="mt-3"> {/* Reduced mt-4 to mt-3 */}
              <p className="font-semibold text-slate-100 text-sm">Contact Us</p> {/* Reduced text-base to text-sm */}
                <a 
                    href="mailto:medify432@gmail.com"
                    className="text-xs text-slate-300 hover:text-green-400 transition-colors duration-200 flex items-center justify-center md:justify-end gap-1.5 mt-0.5" /* Reduced text-sm to text-xs, gap-2 to gap-1.5, mt-1 to mt-0.5 */
                >
                    <Mail className="w-3.5 h-3.5" /> {/* Reduced w-4 h-4 to w-3.5 h-3.5 */}
                    medify432@gmail.com
                </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-700 flex flex-col items-center text-center"> {/* Reduced mt-10 to mt-6, pt-8 to pt-6 */}
          <div className="flex items-center space-x-1.5 text-xs"> {/* Reduced space-x-2 to space-x-1.5, text-sm to text-xs */}
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" /> {/* Reduced h-5 w-5 to h-4 w-4 */}
            <span>by Saumya Chauhan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;