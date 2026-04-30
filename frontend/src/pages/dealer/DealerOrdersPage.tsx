import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react';
import api from '../../services/api';

const DealerOrdersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> {isRTL ? 'مكتمل' : 'Delivered'}</span>;
      case 'PENDING': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> {isRTL ? 'قيد المراجعة' : 'Pending'}</span>;
      case 'PROCESSING': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Package size={14}/> {isRTL ? 'جاري التجهيز' : 'Processing'}</span>;
      case 'SHIPPED': return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={14}/> {isRTL ? 'تم الشحن' : 'Shipped'}</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14}/> {isRTL ? 'ملغي' : 'Cancelled'}</span>;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'طلباتي' : 'My Orders'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `سجل بجميع طلباتك السابقة والحالية` : `History of all your past and current orders`}
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder={isRTL ? 'بحث برقم الطلب...' : 'Search by order number...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'التاريخ' : 'Date'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'المنتجات' : 'Items'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-primary">{isRTL ? 'الإجمالي' : 'Total'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">{isRTL ? 'تفاصيل' : 'Details'}</th>
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
                      <Package size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">{isRTL ? 'لا توجد طلبات مطابقة' : 'No orders found'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#1C1C1C]">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-600">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-black text-primary" dir="ltr">EGP {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <h2 className="text-xl font-black text-[#1C1C1C] mb-1">
                  {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                </h2>
                <p className="text-sm font-bold text-gray-500">{selectedOrder.orderNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-[#1C1C1C] transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-bold text-[#1C1C1C]">{item.product?.name_en || 'Product'}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-primary" dir="ltr">EGP {item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
              <span className="font-bold text-gray-500">{isRTL ? 'المجموع النهائي' : 'Grand Total'}</span>
              <span className="text-2xl font-black text-[#1C1C1C]" dir="ltr">EGP {selectedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DealerOrdersPage;
