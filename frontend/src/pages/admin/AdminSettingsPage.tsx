import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Key, LayoutTemplate, Upload, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import type { NavLink } from '../../contexts/SettingsContext';
import api from '../../services/api';

const AdminSettingsPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user } = useAuth();
  const { settings, refreshSettings } = useSettings();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'general' | 'header'>('header');
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [headerPhone, setHeaderPhone] = useState('');
  const [headerLogo, setHeaderLogo] = useState('');
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  // Passwords State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (settings) {
      setHeaderPhone(settings.header_phone || '');
      setHeaderLogo(settings.header_logo || '');
      setNavLinks(settings.header_nav || []);
    }
  }, [settings]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert(isRTL ? 'كلمة المرور الجديدة غير متطابقة' : 'New passwords do not match');
      return;
    }
    // API call to change password would go here
    alert(isRTL ? 'تم تغيير كلمة المرور بنجاح (محاكاة)' : 'Password changed successfully (Simulation)');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSaveHeaderSettings = async () => {
    try {
      setIsSaving(true);
      await api.put('/settings', {
        header_phone: headerPhone,
        header_nav: JSON.stringify(navLinks)
      });
      await refreshSettings();
      alert(isRTL ? 'تم حفظ إعدادات الهيدر بنجاح' : 'Header settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(isRTL ? 'فشل في حفظ الإعدادات' : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      setIsSaving(true);
      const res = await api.post('/settings/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHeaderLogo(res.data.data.url);
      await refreshSettings();
      alert(isRTL ? 'تم تحديث الشعار بنجاح' : 'Logo updated successfully');
    } catch (error) {
      console.error('Failed to upload logo:', error);
      alert(isRTL ? 'فشل في رفع الشعار' : 'Failed to upload logo');
    } finally {
      setIsSaving(false);
    }
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { labelEN: 'New Link', labelAR: 'رابط جديد', to: '/' }]);
  };

  const removeNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const updateNavLink = (index: number, field: keyof NavLink, value: string) => {
    const newLinks = [...navLinks];
    newLinks[index][field] = value;
    setNavLinks(newLinks);
  };

  const moveNavLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navLinks.length - 1) return;
    
    const newLinks = [...navLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setNavLinks(newLinks);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
          {isRTL ? 'إعدادات النظام' : 'System Settings'}
        </h1>
        <p className="text-gray-500 font-medium text-sm">
          {isRTL ? 'إدارة حسابك وإعدادات المنصة الأساسية' : 'Manage your account and platform settings'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('header')}
          className={`pb-3 font-bold px-2 ${activeTab === 'header' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-[#1C1C1C]'}`}
        >
          {isRTL ? 'إعدادات الهيدر' : 'Header Settings'}
        </button>
        <button 
          onClick={() => setActiveTab('general')}
          className={`pb-3 font-bold px-2 ${activeTab === 'general' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-[#1C1C1C]'}`}
        >
          {isRTL ? 'الإعدادات العامة والأمان' : 'General & Security'}
        </button>
      </div>

      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Logo & Phone */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-[#1C1C1C] flex items-center gap-2">
                <LayoutTemplate size={20} className="text-primary" />
                {isRTL ? 'الشعار ورقم التواصل' : 'Logo & Contact Info'}
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {isRTL ? 'شعار الموقع (Logo)' : 'Website Logo'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-16 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                    {headerLogo ? (
                      <img src={headerLogo} alt="Logo" className="max-h-full max-w-full object-contain mix-blend-multiply p-2" />
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">{isRTL ? 'لا يوجد شعار' : 'No Logo'}</span>
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSaving}
                      className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 text-sm"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {isRTL ? 'رفع شعار جديد' : 'Upload New Logo'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2 font-medium">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {isRTL ? 'رقم الهاتف في أعلى الموقع' : 'Top Bar Phone Number'}
                </label>
                <input 
                  type="text" 
                  value={headerPhone}
                  onChange={(e) => setHeaderPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none font-bold"
                  dir="ltr"
                />
              </div>

            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1C1C1C] flex items-center gap-2">
                <LayoutTemplate size={20} className="text-primary" />
                {isRTL ? 'قوائم التنقل (Navigation Menu)' : 'Navigation Menu'}
              </h2>
              <button 
                onClick={addNavLink}
                className="text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
              >
                <Plus size={16} /> {isRTL ? 'إضافة رابط' : 'Add Link'}
              </button>
            </div>
            
            <div className="p-6 space-y-3">
              {navLinks.map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl">
                  <div className="flex flex-col gap-1 text-gray-400">
                    <button onClick={() => moveNavLink(idx, 'up')} disabled={idx === 0} className="hover:text-[#1C1C1C] disabled:opacity-30"><GripVertical size={16} /></button>
                    <button onClick={() => moveNavLink(idx, 'down')} disabled={idx === navLinks.length - 1} className="hover:text-[#1C1C1C] disabled:opacity-30"><GripVertical size={16} /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                    <input 
                      type="text" placeholder="الاسم بالعربية" 
                      value={link.labelAR} onChange={e => updateNavLink(idx, 'labelAR', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input 
                      type="text" placeholder="English Name" dir="ltr"
                      value={link.labelEN} onChange={e => updateNavLink(idx, 'labelEN', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input 
                      type="text" placeholder="Path (e.g. /products)" dir="ltr"
                      value={link.to} onChange={e => updateNavLink(idx, 'to', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <button 
                    onClick={() => removeNavLink(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-lg shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleSaveHeaderSettings}
                disabled={isSaving}
                className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isRTL ? 'حفظ إعدادات الهيدر' : 'Save Header Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-[#1C1C1C] flex items-center gap-2">
                <Key size={20} className="text-primary" />
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input 
                    type="password" required
                    value={passwords.current}
                    onChange={e => setPasswords({...passwords, current: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input 
                    type="password" required
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </label>
                  <input 
                    type="password" required
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors mt-4"
                >
                  <Save size={18} />
                  {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-500">
        <p className="font-medium text-sm">
          {isRTL ? `تم تسجيل الدخول كـ ${user?.name || 'مدير'}` : `Logged in as ${user?.name || 'Admin'}`}
        </p>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
