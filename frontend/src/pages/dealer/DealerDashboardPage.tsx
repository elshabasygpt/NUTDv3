import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DealerDashboardPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user } = useAuth();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDealerData = async () => {
      try {
        // Fetch orders and warranties for stats
        const [ordersRes, warrantiesRes] = await Promise.all([
          api.get('/orders'),
          api.get('/warranties')
        ]);
        
        const orders = ordersRes.data.data;
        const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0);

        setData({
          ordersCount: orders.length,
          warrantiesCount: warrantiesRes.data.data.length,
          totalSpent,
          recentOrders: orders.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch dealer dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDealerData();
  }, []);

  const profile = user?.dealerProfile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
          {isRTL ? `مرحباً، ${profile?.companyName || user?.name}` : `Welcome, ${profile?.companyName || user?.name}`}
        </h1>
        <p className="text-gray-500 font-medium">
          {isRTL ? 'لوحة التحكم الخاصة بك وتفاصيل حسابك كتاجر معتمد.' : 'Your dashboard and account details as an authorized dealer.'}
        </p>
      </div>

      {/* Tier Info Card */}
      <div className="bg-gradient-to-r from-gray-900 to-[#1C1C1C] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <Award size={32} />
            </div>
            <div>
              <p className="text-gray-400 font-bold mb-1">{isRTL ? 'مستوى الحساب' : 'Account Tier'}</p>
              <div className="flex items-end gap-3">
                <h2 className="text-3xl font-black text-white">{profile?.tier}</h2>
                {profile?.discountRate > 0 && (
                  <span className="text-primary font-bold text-lg mb-1" dir="ltr">({profile.discountRate}% Discount)</span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 font-medium text-sm mb-1">{isRTL ? 'إجمالي المشتريات' : 'Total Purchases'}</p>
            <p className="text-2xl font-black text-white" dir="ltr">EGP {data?.totalSpent?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Package size={28} />
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</p>
            <p className="text-2xl font-black text-[#1C1C1C]">{isLoading ? '-' : data?.ordersCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">{isRTL ? 'الضمانات المسجلة' : 'Registered Warranties'}</p>
            <p className="text-2xl font-black text-[#1C1C1C]">{isLoading ? '-' : data?.warrantiesCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-[#1C1C1C]">
            {isRTL ? 'أحدث طلباتي' : 'My Recent Orders'}
          </h2>
          <Link to="/dealer/orders" className="text-sm font-bold text-primary hover:text-primary-600 flex items-center gap-1">
            {isRTL ? 'عرض الكل' : 'View All'}
            <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-400 font-medium">Loading...</div>
        ) : data?.recentOrders?.length === 0 ? (
          <div className="py-8 text-center text-gray-400 font-medium">
            {isRTL ? 'لا توجد طلبات حتى الآن.' : 'No orders yet.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data?.recentOrders.map((order: any) => (
              <div key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1C1C1C]">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="font-black text-primary" dir="ltr">EGP {order.total.toLocaleString()}</p>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DealerDashboardPage;
