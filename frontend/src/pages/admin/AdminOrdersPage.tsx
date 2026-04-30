import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, Package } from 'lucide-react';
import api from '../../services/api';

interface Order {
  id: string;
  orderNumber: string;
  user: {
    name: string;
    phone: string;
    dealerProfile?: { companyName: string };
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
}

const AdminOrdersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      // Fallback dummy data
      setOrders([
        {
          id: '1', orderNumber: 'ORD-2024-001', 
          user: { name: 'أحمد سعيد', phone: '01001112222', dealerProfile: { companyName: 'المركز الفني' } },
          status: 'PENDING', total: 15400, createdAt: new Date().toISOString()
        },
        {
          id: '2', orderNumber: 'ORD-2024-002', 
          user: { name: 'محمود علي', phone: '01112223333', dealerProfile: { companyName: 'أتو بارتس' } },
          status: 'SHIPPED', total: 8250, createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status', error);
      alert('Error updating order status.');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.dealerProfile?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg font-bold text-sm"><Clock size={14} /> {isRTL ? 'قيد الانتظار' : 'Pending'}</span>;
      case 'PROCESSING': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm"><Package size={14} /> {isRTL ? 'قيد التجهيز' : 'Processing'}</span>;
      case 'SHIPPED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-bold text-sm"><Truck size={14} /> {isRTL ? 'تم الشحن' : 'Shipped'}</span>;
      case 'DELIVERED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg font-bold text-sm"><CheckCircle2 size={14} /> {isRTL ? 'تم التوصيل' : 'Delivered'}</span>;
      case 'CANCELLED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-lg font-bold text-sm"><XCircle size={14} /> {isRTL ? 'ملغي' : 'Cancelled'}</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة الطلبات' : 'Orders Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي الطلبات: ${orders.length}` : `Total Orders: ${orders.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث برقم الطلب أو العميل...' : 'Search by order number or customer...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-80"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'العميل / الشركة' : 'Customer / Company'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'التاريخ' : 'Date'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الإجمالي' : 'Total'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الحالة الحالية' : 'Current Status'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'تحديث الحالة' : 'Update Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    {isRTL ? 'جاري التحميل...' : 'Loading...'}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ShoppingBag size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">{isRTL ? 'لا توجد طلبات مطابقة' : 'No orders found'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#1C1C1C]" dir="ltr">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1C1C1C]">{order.user.dealerProfile?.companyName || order.user.name}</p>
                      <p className="text-sm font-medium text-gray-500">{order.user.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-black text-primary">
                      EGP {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                        className="text-sm font-bold px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="PENDING">{isRTL ? 'قيد الانتظار' : 'Pending'}</option>
                        <option value="PROCESSING">{isRTL ? 'قيد التجهيز' : 'Processing'}</option>
                        <option value="SHIPPED">{isRTL ? 'تم الشحن' : 'Shipped'}</option>
                        <option value="DELIVERED">{isRTL ? 'تم التوصيل' : 'Delivered'}</option>
                        <option value="CANCELLED">{isRTL ? 'ملغي' : 'Cancelled'}</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrdersPage;
