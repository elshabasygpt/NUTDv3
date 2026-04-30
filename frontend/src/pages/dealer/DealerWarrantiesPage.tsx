import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Plus, Search, Clock, ShieldX, ShieldAlert, X } from 'lucide-react';
import api from '../../services/api';

const DealerWarrantiesPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [warranties, setWarranties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vin: '',
    carMake: '',
    carModel: '',
    carYear: '',
    partNumber: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/warranties', formData);
      setIsModalOpen(false);
      setFormData({ customerName: '', customerPhone: '', vin: '', carMake: '', carModel: '', carYear: '', partNumber: '' });
      fetchWarranties();
      alert(isRTL ? 'تم تقديم طلب الضمان بنجاح' : 'Warranty claim submitted successfully');
    } catch (error) {
      console.error('Submit failed', error);
      alert(isRTL ? 'حدث خطأ أثناء الإرسال' : 'Error submitting claim');
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
    w.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'الضمانات المعتمدة' : 'Warranty Claims'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `سجل تفعيل الضمان لعملائك` : `Warranty activation records for your customers`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث برقم الشاسيه...' : 'Search by VIN...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            {isRTL ? 'تسجيل جديد' : 'New Claim'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم الضمان' : 'Warranty No'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'السيارة' : 'Vehicle'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم القطعة' : 'Part No'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'تاريخ التقديم' : 'Date'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No warranties found</td>
                </tr>
              ) : (
                filtered.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-black text-[#1C1C1C]">{w.warrantyNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1C1C1C]">{w.carMake} {w.carModel} ({w.carYear})</p>
                      <p className="text-xs font-mono text-gray-500 bg-gray-100 px-1 w-fit rounded mt-1">{w.vin}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{w.partNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(w.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-xl font-black text-[#1C1C1C]">
                {isRTL ? 'تسجيل مطالبة ضمان' : 'Register Warranty Claim'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#1C1C1C]">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="warrantyForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'اسم العميل' : 'Customer Name'}</label>
                    <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                    <input type="text" required value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'رقم الشاسيه (VIN)' : 'VIN'}</label>
                    <input type="text" required value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'رقم القطعة' : 'Part Number'}</label>
                    <input type="text" required value={formData.partNumber} onChange={e => setFormData({...formData, partNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'ماركة السيارة' : 'Car Make'}</label>
                    <input type="text" required value={formData.carMake} onChange={e => setFormData({...formData, carMake: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'موديل السيارة' : 'Car Model'}</label>
                    <input type="text" required value={formData.carModel} onChange={e => setFormData({...formData, carModel: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'سنة الصنع' : 'Year'}</label>
                    <input type="number" required value={formData.carYear} onChange={e => setFormData({...formData, carYear: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-200">{isRTL ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" form="warrantyForm" className="px-6 py-2 bg-primary text-white rounded-xl font-bold">{isRTL ? 'تقديم الطلب' : 'Submit Claim'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerWarrantiesPage;
