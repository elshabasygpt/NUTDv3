import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, User, Phone, Tag, UploadCloud, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const WarrantyActivationPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    partSerial: '',
    make: '',
    model: '',
    year: '',
    odometerImage: null as File | null,
    invoiceImage: null as File | null,
    vinText: '',
    vinImage: null as File | null,
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const existingWarranties = JSON.parse(localStorage.getItem('nutd_warranties') || '[]');
      
      const newWarranty = {
        id: Date.now(),
        phone: formData.phone,
        partName: formData.partSerial || 'قطعة غيار غير محددة',
        status: 'pending',
        validUntil: isRTL ? 'قيد المراجعة' : 'Pending Review',
        conditions: isRTL ? 'في انتظار موافقة الإدارة' : 'Awaiting management approval',
        make: formData.make,
        model: formData.model,
        year: formData.year,
        dateAdded: new Date().toISOString()
      };
      
      localStorage.setItem('nutd_warranties', JSON.stringify([...existingWarranties, newWarranty]));

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const isStep1Valid = formData.name && formData.phone && formData.partSerial;
  const isStep2Valid = formData.make && formData.model && formData.year;
  const isStep3Valid = formData.odometerImage && formData.invoiceImage && (formData.vinText.length >= 10 || formData.vinImage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'odometerImage' | 'invoiceImage' | 'vinImage') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] bg-[#F8F9FA] flex items-center justify-center py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg w-full shadow-xl border border-gray-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#1C1C1C] mb-4">
            {isRTL ? 'تم استلام طلبك بنجاح!' : 'Request Received Successfully!'}
          </h2>
          <p className="text-gray-500 font-bold mb-8 leading-relaxed">
            {isRTL 
              ? 'طلب تفعيل الضمان الخاص بك قيد المراجعة من قبل الإدارة حالياً. سيتم إشعارك فور الموافقة وتحديد مدة الضمان، ويمكنك متابعة الحالة عبر ملف الصيانة.' 
              : 'Your warranty activation request is currently under review by the administration. You will be notified upon approval, and you can track it via the Maintenance Tracker.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/maintenance" className="bg-primary hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary/20">
              {isRTL ? 'الذهاب لملف الصيانة' : 'Go to Maintenance Tracker'}
            </Link>
            <Link to="/" className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-xl transition-colors">
              {isRTL ? 'العودة للرئيسية' : 'Return to Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Hero Header */}
      <div className="bg-[#1C1F2A] pt-20 pb-28 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {isRTL ? 'تفعيل الضمان الإلكتروني' : 'Activate E-Warranty'}
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            {isRTL 
              ? 'قم بتسجيل بيانات قطعتك لضمان حقك وتفعيل الضمان المعتمد من NUTD بخطوات بسيطة.' 
              : 'Register your part to secure your rights and activate the certified NUTD warranty in simple steps.'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Stepper Header */}
          <div className="flex bg-gray-50 border-b border-gray-100">
            {[1, 2, 3].map((num) => (
              <div key={num} className={`flex-1 py-4 text-center border-e border-gray-100 last:border-0 relative ${step >= num ? 'text-primary' : 'text-gray-400'}`}>
                <div className="font-black text-sm mb-1">{isRTL ? `الخطوة ${num}` : `Step ${num}`}</div>
                <div className="text-xs font-bold opacity-70">
                  {num === 1 ? (isRTL ? 'البيانات' : 'Details') : num === 2 ? (isRTL ? 'السيارة' : 'Vehicle') : (isRTL ? 'المستندات' : 'Documents')}
                </div>
                {step >= num && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10">
            
            {/* Step 1: Customer & Part */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <h3 className="text-2xl font-black text-[#1C1C1C] mb-6">{isRTL ? 'بياناتك الشخصية ورقم القطعة' : 'Your Details & Part Number'}</h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400 pointer-events-none"><User size={20} /></div>
                    <input 
                      type="text" placeholder={isRTL ? 'الاسم بالكامل' : 'Full Name'}
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 ps-12 pe-4 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400 pointer-events-none"><Phone size={20} /></div>
                    <input 
                      type="tel" placeholder={isRTL ? 'رقم الجوال (سيتم ربط الضمان به)' : 'Phone Number (Warranty will be linked to it)'}
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 ps-12 pe-4 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400 pointer-events-none"><Tag size={20} /></div>
                    <input 
                      type="text" placeholder={isRTL ? 'رقم القطعة (Part Number) أو السيريال' : 'Part Number or Serial'}
                      value={formData.partSerial} onChange={e => setFormData({...formData, partSerial: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 ps-12 pe-4 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <h3 className="text-2xl font-black text-[#1C1C1C] mb-6">{isRTL ? 'بيانات السيارة' : 'Vehicle Information'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <select 
                      value={formData.make} 
                      onChange={e => setFormData({...formData, make: e.target.value, model: ''})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>{isRTL ? 'اختر الشركة المصنعة' : 'Select Make'}</option>
                      <option value="تويوتا">تويوتا (Toyota)</option>
                      <option value="هيونداي">هيونداي (Hyundai)</option>
                      <option value="كيا">كيا (Kia)</option>
                      <option value="نيسان">نيسان (Nissan)</option>
                      <option value="هوندا">هوندا (Honda)</option>
                    </select>
                    <ChevronDown size={18} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select 
                      value={formData.model} 
                      onChange={e => setFormData({...formData, model: e.target.value})}
                      disabled={!formData.make}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>{isRTL ? 'اختر الموديل' : 'Select Model'}</option>
                      <option value="Camry">Camry</option>
                      <option value="Corolla">Corolla</option>
                      <option value="Elantra">Elantra</option>
                      <option value="Accent">Accent</option>
                    </select>
                    <ChevronDown size={18} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative md:col-span-2">
                    <select 
                      value={formData.year} 
                      onChange={e => setFormData({...formData, year: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>{isRTL ? 'اختر سنة الصنع' : 'Select Year'}</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                    <ChevronDown size={18} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                  <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-bold text-blue-800">
                    {isRTL ? 'لإثبات الكيلومترات الحالية، سيُطلب منك رفع صورة لعداد السيارة في الخطوة التالية بدلاً من كتابتها يدوياً.' : 'To prove current mileage, you will be asked to upload an image of the odometer in the next step instead of typing it manually.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Proof Uploads */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <h3 className="text-2xl font-black text-[#1C1C1C] mb-6">{isRTL ? 'مستندات الإثبات (إلزامية)' : 'Proof Documents (Required)'}</h3>
                
                <div className="space-y-6">
                  {/* Chassis Number (VIN) */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                    <label className="block text-sm font-black text-gray-800 mb-4">{isRTL ? 'رقم الشاسيه (VIN)' : 'Chassis Number (VIN)'} <span className="text-red-500">*</span></label>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Text Input */}
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-2">{isRTL ? 'أدخل الرقم يدوياً (17 حرف/رقم)' : 'Enter manually (17 characters)'}</label>
                        <input 
                          type="text" 
                          placeholder={isRTL ? 'مثال: WVWZZZ1K...' : 'e.g. WVWZZZ1K...'}
                          value={formData.vinText} 
                          onChange={e => setFormData({...formData, vinText: e.target.value.toUpperCase()})}
                          maxLength={17}
                          className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 font-bold font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                        />
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <span className="text-gray-400 font-bold bg-white px-2 py-1 rounded border border-gray-100 text-[10px]">{isRTL ? 'أو' : 'OR'}</span>
                      </div>

                      {/* Image Upload */}
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-2">{isRTL ? 'أو ارفع صورة واضحة للشاسيه' : 'Or upload clear photo of VIN'}</label>
                        <label className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer h-[58px] ${formData.vinImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-primary'}`}>
                          {formData.vinImage ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="text-green-500" size={16} />
                              <span className="font-bold text-green-600 text-xs truncate max-w-[150px]">{formData.vinImage.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <UploadCloud className="text-gray-400" size={18} />
                              <span className="font-bold text-gray-500 text-xs">
                                {isRTL ? 'إرفاق صورة الشاسيه' : 'Attach VIN photo'}
                              </span>
                            </div>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'vinImage')} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Odometer Image */}
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">{isRTL ? 'صورة عداد الكيلومترات للسيارة' : 'Car Odometer Picture'} <span className="text-red-500">*</span></label>
                    <label className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${formData.odometerImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary'}`}>
                      {formData.odometerImage ? (
                        <>
                          <CheckCircle2 className="text-green-500" size={32} />
                          <span className="font-bold text-green-600">{formData.odometerImage.name}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="text-gray-400" size={32} />
                          <span className="font-bold text-gray-500 text-center">
                            {isRTL ? 'اضغط هنا أو اسحب صورة العداد لإرفاقها' : 'Click or drag odometer photo to upload'}
                          </span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'odometerImage')} />
                    </label>
                  </div>

                  {/* Invoice Image */}
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2">{isRTL ? 'صورة فاتورة الشراء من التاجر' : 'Dealer Purchase Invoice'} <span className="text-red-500">*</span></label>
                    <label className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${formData.invoiceImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary'}`}>
                      {formData.invoiceImage ? (
                        <>
                          <CheckCircle2 className="text-green-500" size={32} />
                          <span className="font-bold text-green-600">{formData.invoiceImage.name}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="text-gray-400" size={32} />
                          <span className="font-bold text-gray-500 text-center">
                            {isRTL ? 'اضغط هنا أو اسحب صورة الفاتورة لإرفاقها' : 'Click or drag invoice photo to upload'}
                          </span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'invoiceImage')} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              {step > 1 ? (
                <button 
                  onClick={handlePrev}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronRight size={18} className={isRTL ? '' : 'rotate-180'} />
                  {isRTL ? 'السابق' : 'Previous'}
                </button>
              ) : <div></div>}

              {step < 3 ? (
                <button 
                  onClick={handleNext}
                  disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                  className="bg-[#1C1F2A] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  {isRTL ? 'التالي' : 'Next'}
                  <ChevronLeft size={18} className={isRTL ? '' : 'rotate-180'} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={!isStep3Valid || isSubmitting}
                  className="bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      {isRTL ? 'إرسال طلب التفعيل' : 'Submit Activation Request'}
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyActivationPage;
