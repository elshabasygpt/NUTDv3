import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Package, ShoppingCart, DollarSign, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

interface DashboardStats {
  products: number;
  dealers: number;
  orders: number;
  warranties: number;
  revenue: number;
  recentOrders: any[];
  monthlyData: any[];
}

const AdminDashboardPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: isRTL ? 'إجمالي المبيعات' : 'Total Sales',
      value: `EGP ${(data?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: isRTL ? 'إجمالي الطلبات' : 'Total Orders',
      value: data?.orders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: isRTL ? 'التجار المسجلين' : 'Registered Dealers',
      value: data?.dealers || 0,
      icon: Users,
      color: 'bg-indigo-500'
    },
    {
      title: isRTL ? 'طلبات الضمان' : 'Warranty Claims',
      value: data?.warranties || 0,
      icon: ShieldCheck,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
          {isRTL ? 'مرحباً بعودتك، مدير النظام' : 'Welcome back, Admin'}
        </h1>
        <p className="text-gray-500 font-medium">
          {isRTL ? 'إليك نظرة سريعة على أداء المنصة اليوم.' : 'Here is a quick overview of the platform performance today.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-black text-[#1C1C1C]" dir="ltr">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-black text-[#1C1C1C] mb-6">
          {isRTL ? 'إحصائيات المبيعات (آخر 6 أشهر)' : 'Sales Statistics (Last 6 Months)'}
        </h2>
        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-gray-400">Loading Chart...</div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E94E1B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E94E1B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey={isRTL ? "name_ar" : "name_en"} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(value) => `${value / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`EGP ${value.toLocaleString()}`, isRTL ? 'المبيعات' : 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E94E1B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#1C1C1C]">
              {isRTL ? 'أحدث الطلبات' : 'Recent Orders'}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package size={48} className="mb-4 opacity-20" />
              <p className="font-medium">{isRTL ? 'جاري التحميل من قاعدة البيانات...' : 'Loading from database...'}</p>
            </div>
          ) : data?.recentOrders?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-bold">
              {isRTL ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data?.recentOrders.map((order: any) => (
                <div key={order.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#1C1C1C]">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.user?.dealerProfile?.companyName || order.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary">EGP {order.total.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <ShieldCheck size={48} className="text-green-500 mb-4 opacity-80" />
          <h2 className="text-lg font-black text-[#1C1C1C] mb-2">
            {isRTL ? 'النظام مؤمن' : 'System Secured'}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {isRTL ? 'كافة البيانات والاتصالات مشفرة ومؤمنة بالكامل.' : 'All data and connections are fully encrypted and secured.'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
