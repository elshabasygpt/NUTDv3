import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Package, Trophy, Truck } from 'lucide-react';

// Custom CountUp Hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeProgress * end);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return { count, elementRef };
};

const StatCard = ({ icon: Icon, end, suffix = '', labelEN, labelAR }: any) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { count, elementRef } = useCountUp(end);

  return (
    <div ref={elementRef} className="flex flex-col items-center p-6 text-center group">
      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
        <Icon size={32} className="text-white" strokeWidth={1.5} />
      </div>
      <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight flex items-baseline gap-1" dir="ltr">
        <span>{suffix}</span>
        <span>{count.toLocaleString()}</span>
      </div>
      <span className="text-gray-400 font-medium text-lg">
        {isRTL ? labelAR : labelEN}
      </span>
    </div>
  );
};

const StatsSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="relative py-24 bg-[#111827] overflow-hidden w-full">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] mix-blend-screen transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] mix-blend-screen transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            {isRTL ? 'أرقام تثبت ريادتنا' : 'Numbers that prove our leadership'}
          </h2>
          <p className="text-gray-400 text-lg">
            {isRTL 
              ? 'نفتخر بشبكة واسعة وخبرة طويلة تجعلنا الخيار الأول لتجار قطع الغيار في مصر.' 
              : 'We take pride in a vast network and deep experience that make us the first choice for auto parts dealers in Egypt.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10" dir={isRTL ? "rtl" : "ltr"}>
          
          <StatCard 
            icon={Package} 
            end={15000} 
            suffix="+"
            labelAR="قطعة غيار متوفرة" 
            labelEN="Available Parts" 
          />
          
          <StatCard 
            icon={Trophy} 
            end={3} 
            suffix=""
            labelAR="توكيلات عالمية حصرية" 
            labelEN="Exclusive Global Brands" 
          />
          
          <StatCard 
            icon={Truck} 
            end={27} 
            suffix=""
            labelAR="محافظة نغطيها" 
            labelEN="Governorates Covered" 
          />
          
          <StatCard 
            icon={Users} 
            end={10000} 
            suffix="+"
            labelAR="تاجر جملة معتمد" 
            labelEN="Wholesale Dealers" 
          />

        </div>
      </div>
    </section>
  );
};

export default StatsSection;
