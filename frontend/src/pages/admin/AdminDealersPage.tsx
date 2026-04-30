import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, CheckCircle2, XCircle, Phone, Mail, Users } from 'lucide-react';
import api from '../../services/api';

interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  isActive: boolean;
  createdAt: string;
}

const AdminDealersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDealers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/dealers');
      setDealers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dealers', error);
      // Fallback dummy data
      setDealers([
        {
          id: '1', name: 'أحمد سعيد', email: 'ahmed@example.com', phone: '01001112222',
          companyName: 'المركز الفني لصيانة السيارات', city: 'القاهرة',
          tier: 'GOLD', isActive: true, createdAt: new Date().toISOString()
        },
        {
          id: '2', name: 'محمود علي', email: 'mahmoud@example.com', phone: '01112223333',
          companyName: 'أتو بارتس', city: 'الإسكندرية',
          tier: 'BRONZE', isActive: false, createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/dealers/${id}`, { isActive: !currentStatus });
      fetchDealers();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Error updating dealer status.');
    }
  };

  const handleChangeTier = async (id: string, newTier: string) => {
    try {
      await api.put(`/dealers/${id}`, { tier: newTier });
      fetchDealers();
    } catch (error) {
      console.error('Failed to update tier', error);
      alert('Error updating dealer tier.');
    }
  };

  const filteredDealers = dealers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone.includes(searchTerm)
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'bg-gray-800 text-gray-100';
      case 'GOLD': return 'bg-yellow-100 text-yellow-800';
      case 'SILVER': return 'bg-gray-100 text-gray-800';
      case 'BRONZE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة الموزعين والتجار' : 'Dealers Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي الموزعين: ${dealers.length}` : `Total Dealers: ${dealers.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث بالاسم، الشركة أو الجوال...' : 'Search by name, company or phone...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-80"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Dealers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'اسم الشركة / التاجر' : 'Company / Dealer Name'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'معلومات الاتصال' : 'Contact Info'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'المدينة' : 'City'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'مستوى الحساب' : 'Account Tier'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'حالة الاعتماد' : 'Approval Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                    {isRTL ? 'جاري التحميل...' : 'Loading...'}
                  </td>
                </tr>
              ) : filteredDealers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">{isRTL ? 'لا يوجد موزعين متطابقين' : 'No dealers found'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDealers.map((dealer) => (
                  <tr key={dealer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-black text-[#1C1C1C]">{dealer.companyName}</p>
                      <p className="text-sm font-medium text-gray-500">{dealer.name}</p>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} /> <span dir="ltr">{dealer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} /> <span>{dealer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600 font-medium">
                        <MapPin size={16} className="text-primary" />
                        {dealer.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={dealer.tier}
                        onChange={(e) => handleChangeTier(dealer.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-primary ${getTierColor(dealer.tier)}`}
                      >
                        <option value="BRONZE">Bronze</option>
                        <option value="SILVER">Silver</option>
                        <option value="GOLD">Gold</option>
                        <option value="PLATINUM">Platinum</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(dealer.id, dealer.isActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                          dealer.isActive 
                            ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {dealer.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {dealer.isActive 
                          ? (isRTL ? 'معتمد' : 'Approved') 
                          : (isRTL ? 'معلق / مرفوض' : 'Pending / Rejected')}
                      </button>
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

export default AdminDealersPage;
