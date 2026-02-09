import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'ar';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    cart: 'Cart',
    admin: 'Admin',
    
    // Product
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    price: 'Price',
    description: 'Description',
    features: 'Features',
    reviews: 'Reviews',
    
    // Comments
    customerReviews: 'Customer Reviews',
    leaveReview: 'Leave a Review',
    rating: 'Rating',
    comment: 'Comment',
    postReview: 'Post Review',
    noReviews: 'No reviews yet. Be the first to share your experience!',
    delete: 'Delete',
    shareYourExperience: 'Share your experience with this product...',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country',
    
    // Forms
    required: 'Required',
    optional: 'Optional',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loading: 'Loading',
    
    // Hero Section
    welcome: 'Welcome to NeoTech',
    tagline: 'Experience the Future of Neural Technology',
    exploreProducts: 'Explore Products',
    learnMore: 'Learn More',
    
    // Product Categories
    quantum: 'Quantum',
    neural: 'Neural',
    cyber: 'Cyber',
    specs: 'Specs',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    products: 'المنتجات',
    about: 'من نحن',
    contact: 'اتصل بنا',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    cart: 'السلة',
    admin: 'المدير',
    
    // Product
    addToCart: 'أضف للسلة',
    outOfStock: 'نفد المخزون',
    inStock: 'متوفر',
    price: 'السعر',
    description: 'الوصف',
    features: 'المميزات',
    reviews: 'التقييمات',
    
    // Comments
    customerReviews: 'تقييمات العملاء',
    leaveReview: 'اكتب تقييم',
    rating: 'التقييم',
    comment: 'التعليق',
    postReview: 'نشر التقييم',
    noReviews: 'لا توجد تقييمات بعد. كن أول من يشارك تجربته!',
    delete: 'حذف',
    shareYourExperience: 'شاركنا تجربتك مع هذا المنتج...',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    postalCode: 'الرمز البريدي',
    country: 'البلد',
    
    // Forms
    required: 'مطلوب',
    optional: 'اختياري',
    submit: 'إرسال',
    cancel: 'إلغاء',
    save: 'حفظ',
    
    // Messages
    success: 'نجح',
    error: 'خطأ',
    loading: 'جاري التحميل',
    
    // Hero Section
    welcome: 'مرحباً بك في NeoTech',
    tagline: 'استمتع بمستقبل التكنولوجيا العصبية',
    exploreProducts: 'استكشف المنتجات',
    learnMore: 'اعرف المزيد',
    
    // Product Categories
    quantum: 'كمي',
    neural: 'عصبي',
    cyber: 'سيبر',
    specs: 'مواصفات',
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      language,
      toggleTheme,
      setLanguage,
      isRTL,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
