import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  ShieldCheck, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  FileText,
  Briefcase,
  Tag,
  LayoutTemplate
} from 'lucide-react';

const AdminLayout = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: isRTL ? 'الرئيسية' : 'Dashboard', path: '/admin' },
    { icon: Package, label: isRTL ? 'المنتجات' : 'Products', path: '/admin/products' },
    { icon: Users, label: isRTL ? 'التجار والموزعين' : 'Dealers', path: '/admin/dealers' },
    { icon: ShoppingCart, label: isRTL ? 'الطلبات' : 'Orders', path: '/admin/orders' },
    { icon: ShieldCheck, label: isRTL ? 'الضمانات' : 'Warranties', path: '/admin/warranties' },
    { icon: FileText, label: isRTL ? 'المدونة' : 'Blog', path: '/admin/blog' },
    { icon: Briefcase, label: isRTL ? 'التوكيلات' : 'Agencies', path: '/admin/agencies' },
    { icon: Tag, label: isRTL ? 'العروض' : 'Offers', path: '/admin/offers' },
    { icon: LayoutTemplate, label: isRTL ? 'الصفحة الرئيسية' : 'Homepage CMS', path: '/admin/homepage' },
    { icon: Settings, label: isRTL ? 'الإعدادات' : 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50
        w-72 bg-[#1C1F2A] text-white transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white text-xl">
              N
            </div>
            <span className="font-black text-xl tracking-wider">
              {isRTL ? 'لوحة الإدارة' : 'NUTD Admin'}
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
            <LogOut size={20} />
            <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-[#1C1C1C]"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black text-[#1C1C1C] hidden sm:block">
              {menuItems.find(item => item.path === location.pathname)?.label || (isRTL ? 'لوحة الإدارة' : 'Dashboard')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button 
              onClick={() => i18n.changeLanguage(isRTL ? 'en' : 'ar')}
              className="text-sm font-bold text-gray-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-primary/30"
            >
              {isRTL ? 'English' : 'عربي'}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 ps-4 border-s border-gray-200">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#1C1C1C]">Admin User</p>
                <p className="text-xs font-medium text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[#F8F9FA] p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;
