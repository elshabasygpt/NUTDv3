import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, X, Briefcase, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

interface Agency {
  id: string;
  name: string;
  description: string;
  logo?: string | null;
  origin: string;
  specialty: string;
  isActive: boolean;
}

const AdminAgenciesPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    origin: '',
    specialty: '',
    isActive: true,
    logo: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/agencies');
      setAgencies(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch agencies', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleOpenModal = (agency?: Agency) => {
    if (agency) {
      setEditingAgency(agency);
      setFormData({
        name: agency.name,
        description: agency.description,
        origin: agency.origin,
        specialty: agency.specialty,
        isActive: agency.isActive,
        logo: agency.logo || ''
      });
    } else {
      setEditingAgency(null);
      setFormData({
        name: '', description: '', origin: '', specialty: '', isActive: true, logo: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setIsUploading(true);
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, logo: res.data.url }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgency) {
        await api.put(`/agencies/${editingAgency.id}`, formData);
      } else {
        await api.post('/agencies', formData);
      }
      setIsModalOpen(false);
      fetchAgencies();
    } catch (error) {
      console.error('Failed to save agency', error);
      alert('Error saving agency.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا التوكيل؟' : 'Are you sure you want to delete this agency?')) {
      try {
        await api.delete(`/agencies/${id}`);
        fetchAgencies();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const filteredAgencies = agencies.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة التوكيلات' : 'Agencies Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي التوكيلات: ${agencies.length}` : `Total Agencies: ${agencies.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث باسم التوكيل...' : 'Search by name...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            {isRTL ? 'إضافة توكيل' : 'Add Agency'}
          </button>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500 py-10">Loading...</p>
        ) : filteredAgencies.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-gray-100">
            <Briefcase size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">{isRTL ? 'لا توجد توكيلات' : 'No agencies found'}</p>
          </div>
        ) : (
          filteredAgencies.map(agency => (
            <div key={agency.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => handleOpenModal(agency)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(agency.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
              
              <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                {agency.logo ? (
                  <img src={agency.logo} alt={agency.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
              </div>
              
              <h3 className="font-black text-lg text-[#1C1C1C] mb-1">{agency.name}</h3>
              <p className="text-sm font-bold text-gray-400 mb-4">{agency.specialty}</p>
              
              <div className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-50 py-2 rounded-lg text-xs font-bold text-gray-600">
                <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">🌍</span>
                {agency.origin}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black text-[#1C1C1C]">
                {editingAgency ? (isRTL ? 'تعديل التوكيل' : 'Edit Agency') : (isRTL ? 'إضافة توكيل جديد' : 'Add New Agency')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="agencyForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'شعار التوكيل (Logo)' : 'Agency Logo'}
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.logo ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 p-2">
                        <img src={formData.logo} alt="Preview" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setFormData({...formData, logo: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 shrink-0">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <input 
                      type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {isUploading && <p className="text-xs text-primary mt-2">Uploading...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'اسم التوكيل' : 'Agency Name'} *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'الوصف' : 'Description'} *</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'المنشأ (البلد)' : 'Origin'} *</label>
                    <input type="text" required value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'التخصص' : 'Specialty'} *</label>
                    <input type="text" required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 md:col-span-2">
                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-primary focus:ring-primary rounded border-gray-300" />
                    <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">{isRTL ? 'توكيل نشط' : 'Active Agency'}</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" form="agencyForm" disabled={isUploading} className="bg-primary hover:bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                {isRTL ? 'حفظ التوكيل' : 'Save Agency'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgenciesPage;
