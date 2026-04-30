import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Globe, Phone, Heart, ShoppingCart,
  MapPin, User, Search, Car, ShieldCheck
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import CartDrawer from './CartDrawer';

const Header = () => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [garage, setGarage] = useState<any>(null);
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadGarage = () => {
      const saved = localStorage.getItem('myGarage');
      if (saved) {
        try {
          setGarage(JSON.parse(saved));
        } catch (e) {}
      } else {
        setGarage(null);
      }
    };
    
    loadGarage();
    window.addEventListener('garageUpdated', loadGarage);
    return () => window.removeEventListener('garageUpdated', loadGarage);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  const navLinks = settings.header_nav;

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1C1F2A] text-gray-300 text-[13px] py-2.5 px-4 font-medium" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Globe size={14} />
              <span>{isRTL ? 'العربية' : 'English'}</span>
            </button>
            {!user && (
              <Link to="/register" className="hover:text-primary transition-colors flex items-center gap-1.5 text-primary font-bold">
                <User size={14} />
                <span>{isRTL ? 'انضم كموزع' : 'Join as Distributor'}</span>
              </Link>
            )}
            
            {user ? (
              <Link to={user.role === 'ADMIN' ? '/admin' : '/dealer'} className="hover:text-primary transition-colors flex items-center gap-1.5 font-bold text-primary">
                <User size={14} />
                <span>{isRTL ? 'بوابتي' : 'My Portal'}</span>
              </Link>
            ) : (
              <Link to="/login" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <User size={14} />
                <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
              </Link>
            )}
            <Link to="/wishlist" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Heart size={14} />
              <span>{isRTL ? 'المفضلة' : 'Wishlist'}</span>
            </Link>
            <Link to="/track" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{isRTL ? 'تتبع الطلب' : 'Track Order'}</span>
            </Link>
            <Link to="/maintenance" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Car size={14} />
              <span>{isRTL ? 'ملف الصيانة' : 'Maintenance'}</span>
            </Link>
            <Link to="/warranty" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>{isRTL ? 'تفعيل الضمان' : 'Activate Warranty'}</span>
            </Link>
            
            {/* My Garage Indicator */}
            {garage && (
              <div className="hidden md:flex items-center gap-1.5 text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-[12px] border border-primary/20">
                <Car size={13} />
                <span>{isRTL ? 'جراجي:' : 'My Garage:'} {garage.make} {garage.model}</span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('myGarage');
                    window.dispatchEvent(new Event('garageUpdated'));
                  }}
                  className={`${isRTL ? 'mr-1' : 'ml-1'} text-gray-400 hover:text-red-500 transition-colors`}
                  aria-label="Clear Garage"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <a href={`tel:${settings.header_phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-primary transition-colors font-bold">
              <span dir="ltr">{settings.header_phone}</span>
              <Phone size={14} />
            </a>
          </div>

        </div>
      </div>

      {/* Main nav */}
      <header
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-md py-3' : 'shadow-sm py-4'
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-8">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-4 shrink-0">
            {/* Dynamic Logo */}
            <img src={settings.header_logo} alt="NUTD Logo" className="h-10" />
            
            <div className={`hidden md:flex items-center gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex flex-col">
                <span className="text-dark font-black text-[15px] leading-tight">
                  {isRTL ? 'نماء المتحدة للتجارة والتوزيع' : 'Namā United Trading & Distribution'}
                </span>
                <span className="text-gray-500 text-[11px] leading-tight mt-0.5">
                  {isRTL ? 'استيراد قطع غيار السيارات' : 'Auto Parts Import'}
                </span>
              </div>
              <div className="text-dark font-black text-2xl tracking-tight uppercase ms-2 border-s-2 border-gray-200 ps-3">
                NUTD
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={idx}
                  to={link.to}
                  className={`text-[15px] font-bold transition-colors relative py-2 ${
                    isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {isRTL ? link.labelAR : link.labelEN}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-md" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Left Actions (Search & Cart) */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <button className="text-gray-700 hover:text-primary transition-colors">
              <Search size={22} />
            </button>
            <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-primary transition-colors relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 absolute w-full shadow-lg">
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 font-bold"
                  onClick={() => setMenuOpen(false)}
                >
                  {isRTL ? link.labelAR : link.labelEN}
                </Link>
              ))}
              <button 
                onClick={() => { setMenuOpen(false); setCartOpen(true); }}
                className="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 font-bold text-start flex justify-between"
              >
                {isRTL ? 'السلة' : 'Cart'}
                {totalItems > 0 && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>}
              </button>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
