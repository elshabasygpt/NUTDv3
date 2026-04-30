import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Menu,
  X,
  ShieldCheck,
  User,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DealerLayout = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dealer', icon: LayoutDashboard, label: isRTL ? 'لوحة التحكم' : 'Dashboard' },
    { path: '/dealer/orders', icon: Package, label: isRTL ? 'طلباتي' : 'My Orders' },
    { path: '/dealer/warranties', icon: ShieldCheck, label: isRTL ? 'الضمانات' : 'Warranties' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen bg-[#0A0D14] text-white w-64 shrink-0 z-50
        transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
          <img src="/assets/images/nutd-logo.svg" alt="NUTD Logo" className="h-8" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{user?.dealerProfile?.companyName || user?.name}</p>
            <p className="text-xs text-gray-400 font-bold">{user?.dealerProfile?.tier} Partner</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full text-left"
          >
            <Home size={20} className="text-gray-500" />
            {isRTL ? 'العودة للمتجر' : 'Back to Store'}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
          >
            <LogOut size={20} />
            {isRTL ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center px-6 shrink-0 lg:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DealerLayout;
