import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ShieldCheck, ShieldAlert, ShieldX, Clock } from 'lucide-react';
import api from '../../services/api';

const AdminWarrantiesPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [warranties, setWarranties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWarranties = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/warranties');
      setWarranties(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch warranties', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (window.confirm(isRTL ? 'تأكيد تغيير حالة الضمان؟' : 'Confirm status change?')) {
      try {
        await api.put(`/warranties/${id}`, { status });
        fetchWarranties();
      } catch (error) {
        console.error('Update failed', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><ShieldCheck size={14}/> {isRTL ? 'مفعل' : 'Active'}</span>;
      case 'PENDING': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> {isRTL ? 'قيد المراجعة' : 'Pending'}</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><ShieldX size={14}/> {isRTL ? 'مرفوض' : 'Rejected'}</span>;
      case 'EXPIRED': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><ShieldAlert size={14}/> {isRTL ? 'منتهي' : 'Expired'}</span>;
      default: return null;
    }
  };

  const filtered = warranties.filter(w => 
    w.warrantyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة الضمانات' : 'Warranties Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي طلبات الضمان: ${warranties.length}` : `Total Warranties: ${warranties.length}`}
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder={isRTL ? 'بحث برقم الضمان أو الشاسيه...' : 'Search by warranty or VIN...'}
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
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم الضمان' : 'Warranty No'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'السيارة (شاسيه)' : 'Vehicle (VIN)'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم القطعة' : 'Part No'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'تاريخ الطلب' : 'Date'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">{isRTL ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 font-medium">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 font-medium">No warranties found</td>
                </tr>
              ) : (
                filtered.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#1C1C1C]">{w.warrantyNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1C1C1C]">{w.customerName}</p>
                      <p className="text-xs text-gray-500" dir="ltr">{w.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1C1C1C]">{w.carMake} {w.carModel} ({w.carYear})</p>
                      <p className="text-xs font-mono text-gray-500 bg-gray-100 px-1 w-fit rounded mt-1">{w.vin}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{w.partNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(w.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={w.status}
                        onChange={(e) => updateStatus(w.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-600"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active (Approve)</option>
                        <option value="REJECTED">Reject</option>
                        <option value="EXPIRED">Expired</option>
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

export default AdminWarrantiesPage;
