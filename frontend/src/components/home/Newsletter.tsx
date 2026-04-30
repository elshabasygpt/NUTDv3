import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MailOpen } from 'lucide-react';

const Newsletter = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="py-8 bg-[#1C1F2A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6" dir={isRTL ? "rtl" : "ltr"}>
          
          {/* Right Side (Icon & Text) */}
          <div className="flex items-center gap-6">
            
            {/* Envelope Icon (Mocking the 3D envelope with a stylized icon) */}
            <div className="relative w-16 h-16 flex items-center justify-center bg-[#2A2E3D] rounded-xl shrink-0">
               <MailOpen size={36} className="text-primary absolute z-10" strokeWidth={1.5} />
               <div className="absolute top-2 w-10 h-8 bg-white/10 rounded border border-white/5 z-0 translate-y-[-10px]"></div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl md:text-[22px] font-black text-white mb-1">
                {isRTL ? 'اشترك ليصلك كل جديد' : 'Subscribe to our newsletter'}
              </h2>
              <p className="text-gray-400 text-[13px] font-medium">
                {isRTL ? 'عروض حصرية، منتجات جديدة ونصائح صيانة مباشرة إلى بريدك' : 'Exclusive offers, new products, and maintenance tips direct to your inbox'}
              </p>
            </div>
          </div>

          {/* Left Side (Input Form) */}
          <div className="w-full md:w-auto min-w-[400px]">
            {sent ? (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-6 py-4 font-semibold text-center h-[54px] flex items-center justify-center">
                {isRTL ? '✅ شكراً! تم التسجيل بنجاح.' : '✅ Subscribed successfully!'}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRTL ? 'ادخل بريدك الإلكتروني' : 'Enter your email'}
                  required
                  className="w-full bg-white border-0 text-gray-800 placeholder-gray-400 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
                <button
                  type="submit"
                  className={`absolute ${isRTL ? 'left-1.5' : 'right-1.5'} top-1.5 bottom-1.5 bg-primary text-white font-bold text-sm px-8 rounded-lg hover:bg-primary-600 transition-colors shadow-sm`}
                >
                  {isRTL ? 'اشترك' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
