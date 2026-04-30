import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: 'wholesale',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        subject: 'wholesale',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      titleAR: 'المركز الرئيسي',
      titleEN: 'Headquarters',
      detailsAR: 'مبنى 56 - كمبوند الكناريا، منطقة الخمائل\nالسادس من أكتوبر - الجيزة',
      detailsEN: 'Building 56 - Elkanaria Compound, Elkhamael Area\n6th of October - Giza'
    },
    {
      icon: Phone,
      titleAR: 'اتصل بنا',
      titleEN: 'Call Us',
      detailsAR: '+20 100 123 4567\n+20 111 987 6543',
      detailsEN: '+20 100 123 4567\n+20 111 987 6543'
    },
    {
      icon: Mail,
      titleAR: 'البريد الإلكتروني',
      titleEN: 'Email',
      detailsAR: 'المبيعات: sales@nutd.com.eg\nالدعم: info@nutd.com.eg',
      detailsEN: 'Sales: sales@nutd.com.eg\nSupport: info@nutd.com.eg'
    },
    {
      icon: Clock,
      titleAR: 'ساعات العمل',
      titleEN: 'Working Hours',
      detailsAR: 'السبت - الخميس\n09:00 صباحاً - 06:00 مساءً',
      detailsEN: 'Saturday - Thursday\n09:00 AM - 06:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-400">{isRTL ? 'تواصل معنا' : 'Contact Us'}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#1C1F2A] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {isRTL ? 'نحن هنا لخدمتك' : 'We Are Here to Serve You'}
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            {isRTL 
              ? 'تواصل مع فريق نماء المتحدة للاستفسار عن أسعار الجملة، الشراكات، أو طلب الدعم الفني.' 
              : 'Contact Namā United team for wholesale pricing, partnerships, or technical support.'}
          </p>
        </div>
      </section>

      <section className="py-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <info.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1C1C1C] mb-2">
                      {isRTL ? info.titleAR : info.titleEN}
                    </h3>
                    <p className="text-gray-500 font-bold text-sm whitespace-pre-line leading-relaxed" dir={info.icon === Phone ? 'ltr' : 'auto'}>
                      {isRTL ? info.detailsAR : info.detailsEN}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="mb-8 relative z-10">
                  <h2 className="text-2xl font-black text-[#1C1C1C] mb-2">
                    {isRTL ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                  </h2>
                  <p className="text-gray-500 font-medium">
                    {isRTL ? 'سيقوم فريق المبيعات بالتواصل معك في أقرب وقت ممكن.' : 'Our sales team will get back to you as soon as possible.'}
                  </p>
                </div>

                {isSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-green-800 mb-2">
                      {isRTL ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}
                    </h3>
                    <p className="text-green-600 font-bold">
                      {isRTL ? 'شكراً لتواصلك معنا، سنقوم بالرد عليك قريباً.' : 'Thank you for contacting us, we will reply shortly.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {isRTL ? 'الاسم بالكامل' : 'Full Name'} <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                          placeholder={isRTL ? 'مثال: أحمد محمود' : 'e.g. Ahmed Mahmoud'}
                        />
                      </div>
                      
                      {/* Company/Center Name */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {isRTL ? 'اسم الشركة / مركز الصيانة' : 'Company / Service Center Name'}
                        </label>
                        <input 
                          type="text" 
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                          placeholder={isRTL ? 'اسم مؤسستك' : 'Your organization name'}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {isRTL ? 'رقم الجوال' : 'Phone Number'} <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-left"
                          dir="ltr"
                          placeholder="+20 10X XXX XXXX"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-left"
                          dir="ltr"
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {isRTL ? 'موضوع الرسالة' : 'Subject'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select 
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-gray-700"
                        >
                          <option value="wholesale">{isRTL ? 'طلب تسعير جملة / انضمام كموزع' : 'Wholesale Quote / Join as Dealer'}</option>
                          <option value="technical">{isRTL ? 'استفسار فني / دعم فني' : 'Technical Inquiry / Support'}</option>
                          <option value="warranty">{isRTL ? 'مشكلة في تفعيل الضمان' : 'Warranty Activation Issue'}</option>
                          <option value="complaint">{isRTL ? 'شكوى / اقتراح' : 'Complaint / Suggestion'}</option>
                          <option value="other">{isRTL ? 'أخرى' : 'Other'}</option>
                        </select>
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} pointer-events-none text-gray-400`}>
                          <ChevronRight size={18} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {isRTL ? 'نص الرسالة' : 'Message'} <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium resize-none"
                        placeholder={isRTL ? 'اكتب تفاصيل طلبك هنا...' : 'Write your request details here...'}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#1C1F2A] hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send size={20} className={isRTL ? 'rotate-180' : ''} />
                          {isRTL ? 'إرسال الرسالة' : 'Send Message'}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 overflow-hidden h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.611850383!2d31.0664972!3d29.9723707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458510a26d713bd%3A0x8e8ab3c9a0c2049e!2s6th%20of%20October%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1714452000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '1.5rem' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="NUTD Location"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
