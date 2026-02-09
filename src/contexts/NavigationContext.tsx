import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextType {
  currentPage: 'home' | 'login' | 'signup' | 'admin' | 'product';
  currentProductId: string | null;
  navigate: (page: 'home' | 'login' | 'signup' | 'admin' | 'product', productId?: string) => void;
  getCurrentPath: () => string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'admin' | 'product'>('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Initialize from URL on mount
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/login') {
        setCurrentPage('login');
        setCurrentProductId(null);
      } else if (path === '/signup') {
        setCurrentPage('signup');
        setCurrentProductId(null);
      } else if (path === '/admin') {
        setCurrentPage('admin');
        setCurrentProductId(null);
      } else if (path.startsWith('/product/')) {
        const productId = path.split('/')[2];
        setCurrentPage('product');
        setCurrentProductId(productId);
      } else {
        setCurrentPage('home');
        setCurrentProductId(null);
      }
    };

    // Check current route on initial load
    handleRoute();

    // Listen for browser back/forward buttons
    const handlePopState = () => {
      handleRoute();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: 'home' | 'login' | 'signup' | 'admin' | 'product', productId?: string) => {
    setCurrentPage(page);
    setCurrentProductId(productId || null);

    // Update URL without page reload
    let newPath = '/';
    switch (page) {
      case 'login':
        newPath = '/login';
        break;
      case 'signup':
        newPath = '/signup';
        break;
      case 'admin':
        newPath = '/admin';
        break;
      case 'product':
        if (productId) {
          newPath = `/product/${productId}`;
        } else {
          newPath = '/product';
        }
        break;
      case 'home':
      default:
        newPath = '/';
        break;
    }

    window.history.pushState({}, '', newPath);
  };

  const getCurrentPath = () => {
    return window.location.pathname;
  };

  return (
    <NavigationContext.Provider value={{
      currentPage,
      currentProductId,
      navigate,
      getCurrentPath
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
