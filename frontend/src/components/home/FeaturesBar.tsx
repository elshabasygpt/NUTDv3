import { useTranslation } from 'react-i18next';
import * as LucideIcons from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const FeaturesBar = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { settings } = useSettings();
  const features = settings.homepage_features || [];

  if (!features.length) return null;

  return (
    <section className="bg-white border-y border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-x-reverse divide-gray-100">
          {features.map(({ id, icon, titleAr, titleEn, descAr, descEn }) => {
            const IconComponent = (LucideIcons as any)[icon] || LucideIcons.CheckCircle;
            return (
              <div
                key={id}
                className="flex items-center justify-center gap-4 px-4 group"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className="text-gray-800 shrink-0 group-hover:text-primary transition-colors">
                  <IconComponent size={36} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <div className="font-bold text-[#1C1C1C] text-[17px] mb-0.5 group-hover:text-primary transition-colors">
                    {isRTL ? titleAr : titleEn}
                  </div>
                  <div className="text-gray-500 text-[13px]">
                    {isRTL ? descAr : descEn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
